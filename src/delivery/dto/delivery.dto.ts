import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { SENDER_CITIES, TARIFFS } from '../../constants/delivery';

export class DeliveryDTO {
  @IsString()
  @IsIn(Object.keys(SENDER_CITIES))
  senderCityId: string;
  @IsNumberString()
  receiverCityId: number;
  @IsNumberString()
  @IsIn(Object.keys(TARIFFS))
  tariffId: number;
  @IsNotEmpty()
  quantity: string;
}
