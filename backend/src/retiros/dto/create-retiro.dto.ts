import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRetiroDto {
  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser mayor a 0' }) // No permitir retiros de 0
  monto: number;

  @IsString()
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  motivo: string;

  @IsString()
  @IsNotEmpty({ message: 'La forma de pago es obligatoria' })
  formaPago: string;
}

