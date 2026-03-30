import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from 'src/articulos/articulo.entity';
import { Cliente } from 'src/clientes/cliente.entity';
import { determinarTurno } from 'src/common/turnos.util';
import {
  DataSource,
  Repository,
  FindOptionsWhere,
  Between,
  Not,
  IsNull,
  In
} from 'typeorm';
import { CreateVentaDto, RegistrarPagoDto } from './dto/venta.dto';
import { PagarCuentaDto } from './dto/pagar-cuenta.dto'; 
import { VentaDetalle } from './venta-detalle.entity';
import { Venta, VentaEstado } from './venta.entity';

@Injectable()
export class VentasService {
  private readonly logger = new Logger(VentasService.name);

  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(VentaDetalle)
    private readonly detalleRepository: Repository<VentaDetalle>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { clienteId, clienteNombre, items, formaPago, interes, estado } =
      createVentaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotalVenta = 0;
      let totalVenta = 0;
      const detallesVenta: VentaDetalle[] = [];

      // 1. OBTENER EL SIGUIENTE NUMERO DE VENTA
      const [maxResult] = await queryRunner.manager.query(
        'SELECT MAX("numeroVenta") as maxNum FROM ventas',
      );
      const siguienteNumeroVenta = (Number(maxResult?.maxNum) || 0) + 1;

      // 2. Validar cliente
      if (estado === VentaEstado.PENDIENTE && !clienteId && !clienteNombre) {
        throw new Error(
          'El nombre del cliente o el ID del cliente es obligatorio para cuentas corrientes.',
        );
      }

      // 3. Procesar artículos y descontar stock
      for (const itemDto of items) {
        const articulo = await queryRunner.manager.findOne(Articulo, {
          where: { id: itemDto.articuloId },
        });

        if (!articulo) {
          throw new NotFoundException(
            `Artículo con ID #${itemDto.articuloId} no encontrado.`,
          );
        }
        if (articulo.stock < itemDto.cantidad) {
          throw new Error(
            `Stock insuficiente para "${articulo.nombre}". Stock actual: ${articulo.stock}, se solicitan: ${itemDto.cantidad}.`,
          );
        }

        articulo.stock -= itemDto.cantidad;
        await queryRunner.manager.save(Articulo, articulo);

        const precioUnitario = Number(articulo.precio);
        const subtotalItem =
          itemDto.subtotalPersonalizado !== undefined
            ? Number(itemDto.subtotalPersonalizado)
            : precioUnitario * itemDto.cantidad;
        subtotalVenta += subtotalItem;

        const detalle = new VentaDetalle();
        detalle.articuloId = itemDto.articuloId;
        detalle.cantidad = itemDto.cantidad;
        detalle.precioUnitario = precioUnitario;
        detalle.subtotal = subtotalItem;
        detallesVenta.push(detalle);
      }

      // 4. Calcular totales finales
      const interesCalculado = interes || 0;
      totalVenta = subtotalVenta + interesCalculado;
      const ahora = new Date();

      // 5. Crear la Venta principal
      const nuevaVenta = new Venta();
      nuevaVenta.numeroVenta = siguienteNumeroVenta;
      nuevaVenta.fechaHora = ahora;
      nuevaVenta.clienteId = clienteId || null;
      nuevaVenta.clienteNombre = clienteNombre || 'Cliente General';
      nuevaVenta.subtotal = subtotalVenta;
      nuevaVenta.interes = interesCalculado;
      nuevaVenta.total = totalVenta;
      
      // --- NUEVO: Inicializar monto_pagado ---
      // Si la venta nace Completada, está pagada al 100%. Si es Pendiente, pagado es 0.
      nuevaVenta.monto_pagado = estado === VentaEstado.COMPLETADA ? totalVenta : 0;
      // ---------------------------------------

      nuevaVenta.formaPago =
        estado === VentaEstado.COMPLETADA ? formaPago : null;
      nuevaVenta.estado = estado;
      nuevaVenta.turno = determinarTurno(ahora);

      const ventaGuardada = await queryRunner.manager.save(Venta, nuevaVenta);

      // 6. Asignar la VENTA completa al detalle y guardarlos
      for (const detalle of detallesVenta) {
        detalle.venta = ventaGuardada;
        await queryRunner.manager.save(VentaDetalle, detalle);
      }

      // 7. Confirmar transacción
      await queryRunner.commitTransaction();

      this.logger.log(`Venta #${ventaGuardada.numeroVenta} creada exitosamente.`);
      return this.findOne(ventaGuardada.id);
    } catch (err) {
      this.logger.error(`Error al crear la venta: ${err.message}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Busca todas las ventas, opcionalmente filtradas por fecha.
   */
  async findAll(fecha?: string): Promise<Venta[]> {
    const where: FindOptionsWhere<Venta> | FindOptionsWhere<Venta>[] = {};

    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      where.fechaHora = Between(fechaInicio, fechaFin);
    }

    return this.ventaRepository.find({
      where,
      relations: ['cliente', 'items', 'items.articulo'],
      order: { fechaHora: 'DESC' },
    });
  }

  /**
   * Busca todas las interacciones de cuentas corrientes
   */
  async findPendientes(): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: {
        clienteNombre: Not(IsNull())
      },
      relations: ['items', 'items.articulo', 'cliente'],
      order: { fechaHora: 'ASC' },
    });
  }

  /**
   * Busca una venta específica por ID, cargando sus relaciones.
   */
  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['items', 'items.articulo', 'cliente'],
    });
    if (!venta) {
      throw new NotFoundException(`Venta con ID #${id} no encontrada.`);
    }
    return venta;
  }

  async pagarCuentaCorriente(dto: PagarCuentaDto) {
    const { clienteNombre, monto, formaPago, fecha } = dto as any; 
    let dineroDisponible = Number(monto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ---------------------------------------------------------
      // PASO 1: CREAR EL "RECIBO" (La venta que representa el ingreso HOY)
      // ---------------------------------------------------------
      
      // 1. Inicializamos con la fecha/hora ACTUAL (HOY AHORA)
      let fechaPago = new Date(); 

      if (fecha) {
        // Parseamos la fecha que viene del front: "2025-11-25"
        const [year, month, day] = fecha.split('-').map(Number);
        
        // Comparamos con la fecha actual del sistema
        const hoy = new Date();
        const esMismoDia = 
            hoy.getFullYear() === year && 
            (hoy.getMonth() + 1) === month && 
            hoy.getDate() === day;

        // Si la fecha elegida NO es hoy (es decir, es un pago retroactivo de otro día),
        // fijamos esa fecha a las 12:00 del mediodía para evitar problemas de Timezone
        // y asegurar que caiga en ese día específico.
        if (!esMismoDia) {
             fechaPago = new Date(year, month - 1, day, 12, 0, 0);
        }
        // NOTA: Si esMismoDia es true, no hacemos nada, por lo que fechaPago sigue
        // siendo new Date() con la HORA EXACTA actual.
      }

      // Obtener número de venta para el recibo
      const [maxResult] = await queryRunner.manager.query(
        'SELECT MAX("numeroVenta") as maxNum FROM ventas',
      );
      const siguienteNumeroVenta = (Number(maxResult?.maxNum) || 0) + 1;

      const reciboVenta = new Venta();
      reciboVenta.numeroVenta = siguienteNumeroVenta;
      reciboVenta.fechaHora = fechaPago; // Aquí va la fecha calculada
      reciboVenta.clienteNombre = clienteNombre;
      reciboVenta.clienteId = null; 
      reciboVenta.subtotal = dineroDisponible;
      reciboVenta.interes = 0;
      reciboVenta.total = dineroDisponible;
      reciboVenta.monto_pagado = dineroDisponible;
      
      // AQUÍ ES DONDE REGISTRAMOS LA FORMA DE PAGO (Efectivo/Débito) PARA LA CAJA
      reciboVenta.formaPago = formaPago; 
      
      reciboVenta.estado = VentaEstado.COMPLETADA;
      reciboVenta.turno = determinarTurno(fechaPago);
      
      // Guardamos el recibo
      await queryRunner.manager.save(Venta, reciboVenta);

      // (Opcional) Crear un detalle dummy para este recibo
      const detalleRecibo = new VentaDetalle();
      detalleRecibo.venta = reciboVenta;
      detalleRecibo.cantidad = 1;
      detalleRecibo.precioUnitario = dineroDisponible;
      detalleRecibo.subtotal = dineroDisponible;
      
      if (reciboVenta.id) {
          // await queryRunner.manager.save(VentaDetalle, detalleRecibo);
      }
      
      // ---------------------------------------------------------
      // PASO 2: CANCELAR LA DEUDA DE LAS VENTAS VIEJAS
      // ---------------------------------------------------------

      const ventasPendientes = await queryRunner.manager.find(Venta, {
        where: {
          clienteNombre: clienteNombre,
          estado: VentaEstado.PENDIENTE,
        },
        order: {
          fechaHora: 'ASC', // FIFO
        },
      });

      let saldoParaCancelar = Number(monto);
      const ventasActualizadas: Venta[] = [];

      for (const venta of ventasPendientes) {
        if (saldoParaCancelar <= 0.01) break;

        const totalVenta = Number(venta.total);
        const pagadoPrevio = Number(venta.monto_pagado);
        const deudaRestante = totalVenta - pagadoPrevio;

        if (saldoParaCancelar >= deudaRestante) {
          // ALCANZA para pagar toda esta venta vieja
          venta.monto_pagado = totalVenta;
          venta.estado = VentaEstado.COMPLETADA;
          
          // IMPORTANTE: NO tocamos 'formaPago' de la venta vieja.
          
          saldoParaCancelar -= deudaRestante;
        } else {
          // NO ALCANZA, pago parcial
          venta.monto_pagado = pagadoPrevio + saldoParaCancelar;
          venta.estado = VentaEstado.PENDIENTE;
          saldoParaCancelar = 0;
        }

        ventasActualizadas.push(venta);
      }

      // Guardar actualizaciones de deuda
      await queryRunner.manager.save(Venta, ventasActualizadas);

      await queryRunner.commitTransaction();

      this.logger.log(`Pago registrado para ${clienteNombre}. Recibo #${siguienteNumeroVenta}`);

      return {
        message: 'Pago registrado correctamente',
        ventasAfectadas: ventasActualizadas.length,
        reciboGenerado: siguienteNumeroVenta
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error al registrar pago cuenta corriente: ${err.message}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Registra el pago TOTAL de una venta específica (Método antiguo, mantenido por compatibilidad).
   */
  async registrarPago(
    id: number,
    registrarPagoDto: RegistrarPagoDto,
  ): Promise<Venta> {
    const { formaPago, interes } = registrarPagoDto;

    const venta = await this.ventaRepository.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException(`Venta con ID #${id} no encontrada.`);
    }

    if (venta.estado !== VentaEstado.PENDIENTE) {
      throw new Error('Esta venta no está pendiente de pago.');
    }

    const ahora = new Date();
    const interesCalculado = interes || 0;
    const totalActualizado = Number(venta.subtotal) + interesCalculado;

    venta.estado = VentaEstado.COMPLETADA;
    venta.formaPago = formaPago;
    venta.interes = interesCalculado;
    venta.total = totalActualizado;
    
    // --- NUEVO: Actualizar monto_pagado al total ---
    venta.monto_pagado = totalActualizado;
    // ----------------------------------------------

    venta.fechaHora = ahora;
    venta.turno = determinarTurno(ahora);

    this.logger.log(
      `Pago total registrado para Venta #${venta.numeroVenta}.`,
    );
    return this.ventaRepository.save(venta);
  }

  /**
   * Elimina una venta específica de forma permanente (HARD DELETE).
   */
  async delete(id: number): Promise<{ message: string; ventaEliminada: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await queryRunner.manager.findOne(Venta, {
        where: { id },
        relations: ['items'],
      });

      if (!venta) {
        throw new NotFoundException(`Venta con ID #${id} no encontrada.`);
      }

      if (
        venta.estado === VentaEstado.COMPLETADA ||
        venta.estado === VentaEstado.PENDIENTE
      ) {
        // 1. Devolver el stock
        for (const item of venta.items) {
          await queryRunner.manager.increment(
            Articulo,
            { id: item.articuloId },
            'stock',
            item.cantidad,
          );
          this.logger.log(
            `Stock devuelto: ${item.cantidad} a Artículo ID #${item.articuloId}`,
          );
        }
      }

      // 2. Eliminar la venta
      await queryRunner.manager.delete(Venta, { id });

      await queryRunner.commitTransaction();

      this.logger.warn(`Venta #${venta.numeroVenta} eliminada permanentemente.`);

      return {
        message: `Venta #${venta.numeroVenta} eliminada exitosamente`,
        ventaEliminada: venta.numeroVenta,
      };
    } catch (err) {
      this.logger.error(`Error al eliminar la venta: ${err.message}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Elimina todas las ventas y sus detalles (SOLO PARA DESARROLLO).
   */
  async deleteAll(): Promise<{ message: string; ventasEliminadas: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ventas = await queryRunner.manager.find(Venta, {
        relations: ['items'],
      });

      // Devolver stock
      for (const venta of ventas) {
        if (
          venta.estado === VentaEstado.COMPLETADA ||
          venta.estado === VentaEstado.PENDIENTE
        ) {
          for (const item of venta.items) {
            await queryRunner.manager.increment(
              Articulo,
              { id: item.articuloId },
              'stock',
              item.cantidad,
            );
          }
        }
      }

      await queryRunner.manager.delete(VentaDetalle, {});
      const result = await queryRunner.manager.delete(Venta, {});

      // Resetear autoincrement SQLite
      await queryRunner.manager.query(
        `DELETE FROM sqlite_sequence WHERE name = 'ventas'`,
      );
      await queryRunner.manager.query(
        `DELETE FROM sqlite_sequence WHERE name = 'venta_detalles'`,
      );

      await queryRunner.commitTransaction();

      const cantidadEliminada = result.affected || 0;
      this.logger.warn(`Se eliminaron ${cantidadEliminada} ventas de prueba.`);

      return {
        message: 'Todas las ventas fueron eliminadas exitosamente',
        ventasEliminadas: cantidadEliminada,
      };
    } catch (err) {
      this.logger.error(`Error al eliminar ventas: ${err.message}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}