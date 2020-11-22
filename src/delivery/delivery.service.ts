import { HttpService, Injectable } from '@nestjs/common';
import { format, add } from 'date-fns';
import {createHash } from 'crypto';
import { Good } from './interfaces/good.interface';
import { map } from 'rxjs/operators';
import { DeliveryDTO } from './dto/delivery.dto';
import { EXTRA_PACKAGE } from '../constants/delivery';

@Injectable()
export class DeliveryService {

  constructor(private httpService: HttpService) {}

  async getPrice(deliveryDto: DeliveryDTO) {
   const { senderCityId, receiverCityId, tariffId, quantity} = deliveryDto;
    const dateExecute = format(add(new Date(), {
      days: 1,
    }), 'yyyy-MM-dd');

    const authLogin = process.env.CDEK_LOGIN;
    const authPassword = process.env.CDEK_PASSWORD;

    const digest = `${dateExecute}&${authPassword}`;


    const secure = createHash('md5').update(digest).digest('hex');

    const goods: Good[] = [];

    goods.push({
      weight: '2',
      length: '10',
      width: '10',
      height: '10',
    });

    const requestBody = {
      version: '1.0',
      senderCityId,
      receiverCityId,
      authLogin,
      dateExecute,
      secure,
      tariffId,
      goods,
    };


    return this.httpService.post(process.env.CDEK_DELIVERY_PRICE_URL, requestBody).pipe(
      map(response => {
        const { data } = response;

        if (parseInt(quantity, 10) > EXTRA_PACKAGE.ITEMS_COUNT) {
          data.result.priceByCurrency = parseFloat(data.result.priceByCurrency) + EXTRA_PACKAGE.PRICE_KZT;
          data.result.price = parseFloat(data.result.price) + EXTRA_PACKAGE.PRICE;
        }

        return {
          ...data,
          dateExecute,
        };
      }),
    );
  }
}

