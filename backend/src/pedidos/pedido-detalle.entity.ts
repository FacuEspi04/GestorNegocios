import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Articulo } from 'src/articulos/articulo.entity';


@Entity({ name: 'pedido_detalles' })
export class PedidoDetalle {
  @PrimaryGeneratedColumn() // <-- CAMBIO: Quitado "type: 'bigint'" y "unsigned"
  id: number;

  @Column({ name: 'pedido_id', type: 'integer' }) // <-- CAMBIO: 'bigint' a 'integer' y quitado "unsigned"
  pedidoId: number;

  @Column({ name: 'articulo_id', type: 'integer' }) // <-- CAMBIO: 'bigint' a 'integer' y quitado "unsigned"
  articuloId: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad: number;

  // Guardamos el precio de costo (o de venta, según tu front) al momento del pedido
  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Articulo, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;
}