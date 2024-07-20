import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  DELIVERY_COMPANIES,
  SENDER_CITY_IDS,
  TARIFF_IDS,
} from '../../constants/delivery';

export class DeliveryDTO {
  @ValidateIf((o) => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsIn(SENDER_CITY_IDS)
  @IsNumber()
  senderCityId: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsNumber()
  receiverCityId?: number;

  @ValidateIf((o) => o.deliveryCompany === DELIVERY_COMPANIES.CDEK)
  @IsIn(TARIFF_IDS)
  @IsNumber()
  tariffId?: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  @IsIn(Object.keys(DELIVERY_COMPANIES))
  deliveryCompany: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  zip: string;
}
