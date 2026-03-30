import { Categoria } from 'src/categorias/categoria.entity';
import { Marca } from 'src/marcas/marca.entity';
import { PedidoDetalle } from 'src/pedidos/pedido-detalle.entity';
import { VentaDetalle } from 'src/ventas/venta-detalle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany, // <-- 
} from 'typeorm';
// 


@Entity({ name: 'articulos' })
export class Articulo {
  @PrimaryGeneratedColumn() // 
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ name: 'codigo_barras', type: 'varchar', length: 50, unique: true })
  codigo_barras: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // 
  precio: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stock: number;

  @Column({ name: 'stock_minimo', type: 'decimal', precision: 10, scale: 3, default: 0 })
  stock_minimo: number;

  @Column({ name: 'es_pesable', type: 'boolean', default: false })
  esPesable: boolean;

  // --- Relación con Categoría ---
  @Column({ name: 'categoria_id', type: 'integer', nullable: true }) // 
  categoriaId: number | null;

  @ManyToOne(() => Categoria, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria | null; // 

  // --- Relación con Marca ---
  @Column({ name: 'marca_id', type: 'integer', nullable: true }) // 
  marcaId: number | null;

  @ManyToOne(() => Marca, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'marca_id' })
  marca: Marca | null; // 

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' }) // <-- 
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // <-- 
  updatedAt: Date;

  // --- Relaciones Inversas (para que TypeORM sepa de ellas) ---
  @OneToMany(() => VentaDetalle, (detalle) => detalle.articulo)
  itemsVenta: VentaDetalle[];

  @OneToMany(() => PedidoDetalle, (detalle) => detalle.articulo)
  itemsPedido: PedidoDetalle[];
}

