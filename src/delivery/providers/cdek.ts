import { HttpService } from '@nestjs/common';
import { DeliveryDTO } from '../dto/delivery.dto';
import { IDeliveryProvider } from '../interfaces/delivery-provider.interface';
import { IDeliveryPrice } from '../interfaces/delivery-price.interface';
import { IGood } from '../interfaces/good.interface';
import { add, format } from 'date-fns';
import { createHash } from 'crypto';
import { EXTRA_PACKAGE } from '../../constants/delivery';

export class CdekProvider implements IDeliveryProvider {
  constructor(private httpService: HttpService) {}

  private static prepareGoods(count = 1): IGood[] {
    const goods: IGood[] = [];
    goods.push({
      weight: 2 * count,
      length: 21,
      width: 5 * count,
      height: 30,
    });

    return goods;
  }

  private static prepareRequestBodyForGoods(deliveryDto, goods) {
    const { senderCityId, receiverCityId, tariffId } = deliveryDto;

    const dateExecute = format(
      add(new Date(), {
        days: 1,
      }),
      'yyyy-MM-dd',
    );

    const authLogin = process.env.CDEK_LOGIN;
    const authPassword = process.env.CDEK_PASSWORD;

    const digest = `${dateExecute}&${authPassword}`;

    const secure = createHash('md5').update(digest).digest('hex');

    return {
      version: '1.0',
      senderCityId,
      receiverCityId,
      authLogin,
      dateExecute,
      secure,
      tariffId,
      goods,
    };
  }

  async getPrice(deliveryDTO: DeliveryDTO): Promise<IDeliveryPrice> {
    const goods = CdekProvider.prepareGoods(+deliveryDTO.quantity);
    const requestBody = CdekProvider.prepareRequestBodyForGoods(
      deliveryDTO,
      goods,
    );

    return this.httpService
      .post(process.env.CDEK_DELIVERY_PRICE_URL, requestBody)
      .toPromise()
      .then(({ data }) => {
        if ('result' in data) {
          data.result.priceByCurrency = parseFloat(data.result.priceByCurrency);
          data.result.price = parseFloat(data.result.price);

          if (parseInt(deliveryDTO.quantity, 10) > EXTRA_PACKAGE.ITEMS_COUNT) {
            data.result.priceByCurrency += EXTRA_PACKAGE.PRICE_KZT;
            data.result.price += EXTRA_PACKAGE.PRICE;
          }
        }

        return data;
      });
  }
}
