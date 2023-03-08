import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IDelivery } from '../interfaces/delivery.interface';
import { IProduct } from '../interfaces/product.interface';
import { ICustomer } from '../interfaces/customer.interface';
import { IPayboxMeta } from '../interfaces/paybox/meta.interface';
import { Document } from 'mongoose';

@Schema()
export class Order {
  @Prop()
  amount: number;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop()
  delivery: IDelivery;

  @Prop()
  product: IProduct;

  @Prop()
  customer: ICustomer;

  @Prop()
  meta: IPayboxMeta;

  @Prop()
  status: string;

  @Prop()
  createdAt: string;

  @Prop()
  totalPrice: number;
}

export type TOrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
