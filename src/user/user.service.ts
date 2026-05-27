/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { Order } from './schemas/order.schema';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class UserService {
  private stripe: Stripe.Stripe;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    private readonly configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  // GET ALL USERS
  async getAllUsers() {
    return this.userModel
      .find()
      .select('-password -hashedRefreshToken')
      .sort({ createdAt: -1 });
  }

  // UPDATE USER ROLE
  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;

    await user.save();

    return {
      message: 'User role updated successfully',
    };
  }

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

  async createCheckoutSession(userId: string, checkoutData: CheckoutDto) {
    const user = await this.userModel.findById(userId).populate<{
      cart: Array<{ product: ProductDocument; quantity: number }>;
    }>('cart.product');

    if (!user || user.cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const line_items = user.cart.map((item) => ({
      price_data: {
        currency: 'usd',

        product_data: {
          name: item.product.name,
        },

        unit_amount: item.product.price * 100,
      },

      quantity: item.quantity,
    }));

    const totalAmount = user.cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    const order = await this.orderModel.create({
      userId,
      customerName: checkoutData.customerName,

      customerEmail: checkoutData.customerEmail,

      customerPhone: checkoutData.customerPhone,

      deliveryAddress: checkoutData.deliveryAddress,
      products: user.cart.map((item) => ({
        productId: item.product._id.toString(),
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      paymentStatus: 'pending',
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      line_items,

      mode: 'payment',

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    order.stripeSessionId = session.id;

    await order.save();

    return {
      url: session.url,
    };
  }

  async verifyPayment(sessionId: string, userId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new BadRequestException('Payment not completed');
    }

    const order = await this.orderModel.findOne({
      stripeSessionId: sessionId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.paymentStatus = 'paid';

    await order.save();

    const user = await this.userModel.findById(userId);

    if (user) {
      user.cart = [];

      await user.save();
    }

    return {
      message: 'Payment verified',
    };
  }

  async getAllOrders() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async getMyOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'paid' | 'shipped' | 'delivered',
  ) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.paymentStatus = status;

    await order.save();

    return {
      message: 'Order status updated',
    };
  }
}
