import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    type: String,
    default: 'user',
  })
  role!: string;

  @Prop()
  hashedRefreshToken?: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product.name,
    },
  ])
  wishlist!: mongoose.Types.ObjectId[];

  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product.name,
      },

      quantity: {
        type: Number,
        default: 1,
      },
    },
  ])
  cart!: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
