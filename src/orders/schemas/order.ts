import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IDelivery } from '../interfaces/delivery.interface';
import { IProduct } from '../interfaces/product.interface';
import { ICustomer } from '../interfaces/customer.interface';
import { IPayboxMeta } from '../interfaces/paybox/meta.interface';
import * as mongoose from 'mongoose';

@Schema()
export class Order {
  @Prop()
  amount: number;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  delivery: IDelivery;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  product: IProduct;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  customer: ICustomer;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  meta: IPayboxMeta;

  @Prop()
  status: string;

  @Prop()
  createdAt: string;

  @Prop()
  totalPrice: number;
}

export type TOrderDocument = Order & mongoose.Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
