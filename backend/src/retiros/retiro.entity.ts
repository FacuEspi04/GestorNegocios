import { TurnoVenta } from 'src/common/turnos.util';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
// Importamos el enum de turnos que creamos


@Entity({ name: 'retiros' })
export class Retiro {
  @PrimaryGeneratedColumn() // <-- CAMBIO: Quitado "type: 'bigint'"
  id: number;

  @Column({ type: 'datetime' })
  fechaHora: Date; // 'datetime' está bien en SQLite

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // <-- 'unsigned' eliminado
  monto: number;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'varchar', length: 50, default: 'Efectivo' })
  formaPago: string;

  @Column({
    // type: 'enum', <-- LÍNEA ELIMINADA (no soportado por SQLite)
    type: 'varchar', // <-- LÍNEA AÑADIDA (para que SQLite sepa que es texto)
    enum: TurnoVenta,
  })
  turno: TurnoVenta;

  @CreateDateColumn({ name: 'created_at' }) // <-- 'type: datetime' eliminado
  createdAt: Date;
}

