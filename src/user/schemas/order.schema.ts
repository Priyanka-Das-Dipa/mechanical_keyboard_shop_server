/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  customerName!: string;

  @Prop({ required: true })
  customerEmail!: string;

  @Prop({ required: true })
  customerPhone!: string;

  @Prop({ required: true })
  deliveryAddress!: string;

  @Prop({ type: Array, required: true })
  products!: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({
    enum: ['pending', 'paid', 'shipped', 'delivered', 'failed'],
    default: 'pending',
  })
  paymentStatus!: string;

  @Prop()
  stripeSessionId!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
