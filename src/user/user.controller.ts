/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { UserRole } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET ALL USERS
  @UseGuards(JwtAuthGuard)
  @Get('all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // UPDATE USER ROLE
  @UseGuards(JwtAuthGuard)
  @Patch('role/:userId')
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: UserRole },
  ) {
    return this.userService.updateUserRole(userId, body.role);
  }

  // ADD WISHLIST
  @UseGuards(JwtAuthGuard)
  @Post('wishlist/:productId')
  addToWishlist(@Req() req, @Param('productId') productId: string) {
    return this.userService.addToWishlist(req.user.userId, productId);
  }

  // GET WISHLIST
  @UseGuards(JwtAuthGuard)
  @Get('wishlist')
  getWishlist(@Req() req) {
    return this.userService.getWishlist(req.user.userId);
  }

  //REMOVE WISHLIST
  @UseGuards(JwtAuthGuard)
  @Delete('wishlist/:productId')
  removeFromWishlist(@Req() req, @Param('productId') productId: string) {
    return this.userService.removeFromWishlist(req.user.userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cart')
  addToCart(@Req() req, @Body() body: AddToCartDto) {
    return this.userService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  // GET CART
  @UseGuards(JwtAuthGuard)
  @Get('cart')
  getCart(@Req() req) {
    return this.userService.getCart(req.user.userId);
  }

  // REMOVE CART
  @UseGuards(JwtAuthGuard)
  @Delete('cart/:productId')
  removeFromCart(@Req() req, @Param('productId') productId: string) {
    return this.userService.removeFromCart(req.user.userId, productId);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Req() req, @Body() body: CheckoutDto) {
    return this.userService.createCheckoutSession(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-success/:sessionId')
  verifyPayment(@Param('sessionId') sessionId: string, @Req() req) {
    return this.userService.verifyPayment(sessionId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  getAllOrders() {
    return this.userService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  getMyOrders(@Req() req) {
    return this.userService.getMyOrders(req.user.userId);
  }

  @Patch('orders/:orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: 'pending' | 'paid' | 'shipped' | 'delivered' },
  ) {
    return this.userService.updateOrderStatus(orderId, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-stats')
  getDashboardStats() {
    return this.userService.getDashboardStats();
  }
}
