import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DeliveryInterface } from '../interfaces/delivery.interface';
import { ProductInterface } from '../interfaces/product.interface';
import { CustomerInterface } from '../interfaces/customer.interface';
import { PayboxMetaInterface } from '../interfaces/paybox/meta.interface';
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
  delivery: DeliveryInterface;

  @Prop()
  product: ProductInterface;

  @Prop()
  customer: CustomerInterface;

  @Prop()
  meta: PayboxMetaInterface;

  @Prop()
  status: string;

  @Prop()
  createdAt: string;

  @Prop()
  totalPrice: number;
}


export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order)
