import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  brand!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({
    default: 'USD',
  })
  currency!: string;

  @Prop({
    default: 0,
  })
  rating!: number;

  @Prop({
    default: 0,
  })
  reviewCount!: number;

  @Prop({ required: true })
  quantity!: number;

  @Prop({
    type: [String],
    default: [],
  })
  features!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  images!: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
