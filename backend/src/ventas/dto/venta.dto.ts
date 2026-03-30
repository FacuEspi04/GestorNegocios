import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormaPago, VentaEstado } from '../venta.entity';
// Importa los enums desde la entidad


// --- DTO para cada ítem en la venta ---
export class CreateVentaItemDto {
  @IsNumber()
  @Min(1)
  articuloId: number;

  @IsNumber()
  @Min(0.001) // Permite valores como 0.100 kg
  cantidad: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotalPersonalizado?: number;
}

// --- DTO para crear una nueva venta ---
export class CreateVentaDto {
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsOptional()
  @IsString()
  clienteNombre?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateVentaItemDto)
  items: CreateVentaItemDto[];

  @IsEnum(FormaPago)
  @IsOptional() // Opcional, porque si es PENDIENTE, será null
  formaPago: FormaPago;

  @IsNumber()
  @IsOptional()
  @Min(0)
  interes?: number; // El frontend lo envía como % (ej: 10), el servicio lo calcula

  @IsEnum(VentaEstado)
  @IsNotEmpty()
  estado: VentaEstado; // "Pendiente" o "Completada"
}

// --- DTO para registrar un pago (Cuenta Corriente) ---
export class RegistrarPagoDto {
  @IsEnum(FormaPago)
  @IsNotEmpty()
  formaPago: FormaPago;

  @IsNumber()
  @IsOptional()
  @Min(0)
  interes?: number;
}



