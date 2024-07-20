import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryDTO } from './dto/delivery.dto';
import { CitiesByCountryCodeDto } from './dto/cities-by-country-code.dto';
import { PostCodesByCityCodeDto } from './dto/post-codes-by-city-code.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Post('calculate')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPrice(@Body() deliveryDto: DeliveryDTO) {
    return this.deliveryService.getPrice(deliveryDto);
  }

  @Get('cities')
  @UsePipes(new ValidationPipe({ transform: true }))
  getCitiesByCountryCode(@Query() dto: CitiesByCountryCodeDto) {
    return this.deliveryService.getCitiesByCountryCode(dto);
  }

  @Get('postcodes')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPostCodesByCityCode(@Query() dto: PostCodesByCityCodeDto) {
    return this.deliveryService.getPostCodesByCityCode(dto);
  }
}
