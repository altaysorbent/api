import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, Product } from './schemas/product';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findById(id: number): Promise<Product> {
    const product = await this.productModel.findOne({ id }).exec();
    if (!product) {
      throw new NotFoundException('Could not find product');
    }

    return product;
  }
}
