import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { Articulo } from 'src/articulos/articulo.entity';


@Entity({ name: 'venta_detalles' })
export class VentaDetalle {
  @PrimaryGeneratedColumn() // <-- CAMBIO: Quitado "type: 'bigint'" y "unsigned"
  id: number;

  // Relación con la Venta
  @Column({ name: 'numero_venta', type: 'integer' }) // <-- CAMBIO: 'bigint' a 'integer' y quitado "unsigned"
  numeroVenta: number;

  @ManyToOne(() => Venta, (venta) => venta.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_venta' })
  venta: Venta;

  // Relación con el Artículo
  @Column({ name: 'articulo_id', type: 'integer', nullable: true }) // <-- CAMBIO: 'bigint' a 'integer' y quitado "unsigned"
  articuloId: number;

  @ManyToOne(() => Articulo, { onDelete: 'SET NULL', eager: true }) // eager: true carga el artículo
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
