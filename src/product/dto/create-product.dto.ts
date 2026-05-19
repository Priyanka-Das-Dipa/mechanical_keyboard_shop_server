import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  brand!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsString()
  currency!: string;

  @IsNumber()
  rating!: number;

  @IsNumber()
  reviewCount!: number;

  @IsNumber()
  quantity!: number;

  @IsArray()
  @IsOptional()
  features!: string[];
}
