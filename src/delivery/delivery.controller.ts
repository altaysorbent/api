import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryDTO } from './dto/delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('calculate')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPrice(@Query() deliveryDto: DeliveryDTO) {
    return this.deliveryService.getPrice(deliveryDto);
  }
}
