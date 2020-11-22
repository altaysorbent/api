import { Body, Controller, Post, UsePipes, ValidationPipe, Response } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { js2xml } from 'xml-js';
import { ORDER_RESULT_ENDPOINT_URL } from '../constants/order';
import { PayboxRequestDTO } from './dto/payboxRequest.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  createOrder(@Body() orderDto: OrderDTO) {
    return this.ordersService.createOrder(orderDto);
  }

  @Post('result')
  async confirmOrder(@Body() result: PayboxRequestDTO, @Response() res) {
    const response = await this.ordersService.processResult(result, ORDER_RESULT_ENDPOINT_URL);

    res.set('Content-Type', 'text/xml');

    const xml = js2xml(response, { compact: true, ignoreComment: true, spaces: 4 });
    console.log('xml', xml);
    return res.send(xml);

  }
}
