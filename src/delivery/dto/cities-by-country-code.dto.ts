import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { DELIVERY_COUNTRIES } from '../../constants/delivery';

export class CitiesByCountryCodeDto {
  @IsNotEmpty()
  @IsIn(Object.keys(DELIVERY_COUNTRIES))
  @IsString()
  country: string;
}
