/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  checkout(@Req() req) {
    return this.userService.createCheckoutSession(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-success/:sessionId')
  verifyPayment(@Param('sessionId') sessionId: string, @Req() req) {
    return this.userService.verifyPayment(sessionId, req.user.userId);
  }
}
