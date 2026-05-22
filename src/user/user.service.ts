/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return this.userModel.findByIdAndUpdate(userId, {
      hashedRefreshToken,
    });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async addToWishlist(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const alreadyExist = user.wishlist.some(
      (id) => id.toString() === productId,
    );

    if (!alreadyExist) {
      user.wishlist.push(productId as any);
    }

    await user.save();

    return {
      message: 'Added to wishlist',
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    return {
      message: 'Removed from wishlist',
    };
  }

  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId).populate('wishlist');

    return user?.wishlist || [];
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingProduct = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({
        product: productId as any,
        quantity,
      });
    }

    await user.save();

    return {
      message: 'Added to cart',
    };
  }

  async getCart(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: 'cart.product',
    });

    return user?.cart || [];
  }

  async removeFromCart(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();

    return {
      message: 'Removed from cart',
    };
  }
}
