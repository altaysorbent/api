import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TARIFF_IDS } from '../../constants/delivery';

export class CalculateDto {
  @IsString()
  address: string;

  @IsNumber()
  code: number;

  @IsIn(TARIFF_IDS)
  @IsNumber()
  tariff_code?: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  postal_code: string;
}
