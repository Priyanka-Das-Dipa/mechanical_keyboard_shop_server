import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, images: string[]) {
    const product = await this.productModel.create({
      ...createProductDto,
      images,
    });

    return product;
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    return this.productModel.findById(id);
  }
}
