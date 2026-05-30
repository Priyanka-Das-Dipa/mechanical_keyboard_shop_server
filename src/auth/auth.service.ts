import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDTO) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user._id.toString(), user.email);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(
      user._id.toString(),
      hashedRefreshToken,
    );

    return {
      message: 'Registration successful',
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(
      user._id.toString(),
      hashedRefreshToken,
    );

    return {
      message: 'Login successful',
      user,
      tokens,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);

    return {
      message: 'Logout successful',
    };
  }

  async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    } as JwtSignOptions);

    // console.log(this.configService.get<string>('JWT_ACCESS_SECRET'));

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    } as JwtSignOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}
