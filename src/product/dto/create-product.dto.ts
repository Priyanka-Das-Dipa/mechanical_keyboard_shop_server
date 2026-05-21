/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  brand!: string;

  @IsString()
  description!: string;

  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsString()
  currency!: string;

  @Type(() => Number)
  @IsNumber()
  rating!: number;

  @Type(() => Number)
  @IsNumber()
  reviewCount!: number;

  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @IsArray()
  @IsOptional()
  features!: string[];
}
