import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsNumber, Min, IsString, ValidateNested } from 'class-validator';

class CreatePedidoItemDto {
  @IsInt()
  @IsPositive()
  articuloId: number;

  @IsNumber()
  @Min(0.001)
  cantidad: number;
}

export class CreatePedidoDto {
  @IsInt()
  @IsPositive()
  proveedorId: number;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  @IsNotEmpty()
  items: CreatePedidoItemDto[];
}
