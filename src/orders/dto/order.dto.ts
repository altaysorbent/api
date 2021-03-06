import {
  IsDefined,
  IsEmail,
  IsIn,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { ProductInterface } from '../interfaces/product.interface';
import { DeliveryInterface } from '../interfaces/delivery.interface';
import { CustomerInterface } from '../interfaces/customer.interface';
import { Type } from 'class-transformer';
import { DELIVERY_COMPANIES, SENDER_CITY_IDS, TARIFF_IDS } from '../../constants/delivery';


class Customer implements CustomerInterface {
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

class Delivery implements DeliveryInterface {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @ValidateIf(o => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsNotEmpty()
  cityFull: string;

  @ValidateIf(o => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsNumber()
  cityId: number;

  @IsNotEmpty()
  zip: string;

  @IsNumber()
  price: number;

  @ValidateIf(o => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsNumber()
  @IsIn(TARIFF_IDS)
  tariffId: number;

  @ValidateIf(o => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsNumber()
  @IsIn(SENDER_CITY_IDS)
  senderCityId: number;

  @IsNotEmpty()
  @IsIn(Object.values(DELIVERY_COMPANIES))
  company: string;
}


class Product implements ProductInterface {
  @IsInt()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsInt()
  price: number;
  @IsInt()
  count: number;
  @IsNumber()
  total: number;
}


export class OrderDTO {
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => Customer)
  customer: Customer;

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => Delivery)
  delivery: Delivery;

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => Product)
  product: Product;
}
