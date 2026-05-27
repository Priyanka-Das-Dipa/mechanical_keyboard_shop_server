import { IsIn, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(['pending', 'processing', 'shipped', 'delivered'])
  orderStatus!: string;
}
