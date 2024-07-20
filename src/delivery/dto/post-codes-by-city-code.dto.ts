import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PostCodesByCityCodeDto {
  @IsNotEmpty()
  @IsNumberString()
  code: number;
}
