/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(query: any) {
    const {
      searchTerm,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 6,
    } = query;
    const { sortBy = 'createdAt', order = 'desc' } = query;

    const filter: any = {};
    const sort: any = {};

    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Search
    if (searchTerm) {
      filter.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: 'i',
          },
        },

        {
          brand: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ];
    }

    // Brand filter
    if (brand) {
      filter.brand = brand;
    }

    // Price Range
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await this.productModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await this.productModel.countDocuments(filter);

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPage: Math.ceil(total / Number(limit)),
      },

      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, payload: Partial<CreateProductDto>) {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product deleted successfully',
    };
  }

  async getBrands() {
    return this.productModel.distinct('brand');
  }
}
