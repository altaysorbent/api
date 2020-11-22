import {
  IsDefined,
  IsEmail, IsIn,
  IsInt, IsMobilePhone,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductInterface } from '../interfaces/product.interface';
import { DeliveryInterface } from '../interfaces/delivery.interface';
import { CustomerInterface } from '../interfaces/customer.interface';
import { Type } from 'class-transformer';
import { SENDER_CITIES, TARIFFS } from '../../constants/delivery';


class Customer implements CustomerInterface{
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsMobilePhone()
  @IsPhoneNumber(null)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class Delivery implements DeliveryInterface{
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  cityFull: string;

  @IsNotEmpty()
  cityId: string;

  @IsNotEmpty()
  zip: string;

  @IsInt()
  price: number;

  @IsString()
  @IsIn(Object.keys(TARIFFS))
  tariffId: string;

  @IsString()
  @IsIn(Object.keys(SENDER_CITIES))
  senderCityId: string;
}


class Product implements ProductInterface{
  @IsInt()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsInt()
  price: number;
  @IsInt()
  count: number;
  @IsInt()
  total: number;
}



export class OrderDTO {
  @ValidateNested({ each: true})
  @IsDefined()
  @Type(() => Customer)
  customer: Customer;

  @ValidateNested({ each: true})
  @IsDefined()
  @Type(() => Delivery)
  delivery: Delivery;

  @ValidateNested({ each: true})
  @IsDefined()
  @Type(() => Product)
  product: Product;
}
