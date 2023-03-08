import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DELIVERY_COMPANIES,
  SENDER_CITIES,
  TARIFFS,
} from '../../constants/delivery';

export class DeliveryDTO {
  @IsOptional()
  @IsIn(Object.keys(SENDER_CITIES))
  @IsString()
  senderCityId?: string;

  @IsOptional()
  @IsNumberString()
  receiverCityId?: number;

  @IsOptional()
  @IsIn(Object.keys(TARIFFS))
  @IsNumberString()
  tariffId?: number;

  @IsNotEmpty()
  quantity: string;

  @IsString()
  @IsIn(Object.keys(DELIVERY_COMPANIES))
  deliveryCompany: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;
}
