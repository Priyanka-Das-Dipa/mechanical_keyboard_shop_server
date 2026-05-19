import { Injectable } from '@nestjs/common';
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
}
