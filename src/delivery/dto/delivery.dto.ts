import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SENDER_CITIES, TARIFFS } from '../../constants/delivery';

export class DeliveryDTO {
  @IsString()
  @IsIn(Object.keys(SENDER_CITIES))
  senderCityId: string;
  @IsNotEmpty()
  receiverCityId: string;
  @IsString()
  @IsIn(Object.keys(TARIFFS))
  tariffId: string;
  @IsNotEmpty()
  quantity: string;
}
