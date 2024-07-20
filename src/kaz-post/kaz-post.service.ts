import { Injectable } from '@nestjs/common';
import { DeliveryDTO } from '../delivery/dto/delivery.dto';
import { IDeliveryPrice } from '../delivery/interfaces/delivery-price.interface';
import { EXTRA_PACKAGE, KAZ_POST_PRICE } from '../constants/delivery';
import { DEFAULT_CURRENCY } from '../constants/order';
import { HttpService } from '@nestjs/axios';
import { IDeliveryProvider } from '../delivery/interfaces/delivery-provider.interface';

@Injectable()
export class KazPostService implements IDeliveryProvider {
  constructor(private httpService: HttpService) {}
  async getPrice(deliveryDTO: DeliveryDTO): Promise<IDeliveryPrice> {
    return new Promise((resolve) => {
      const packagesCount = Math.ceil(
        deliveryDTO.quantity / EXTRA_PACKAGE.ITEMS_COUNT,
      );

      const result = {
        currency: DEFAULT_CURRENCY,
        price: KAZ_POST_PRICE.PRICE * packagesCount,
        priceByCurrency: KAZ_POST_PRICE.PRICE_KZT * packagesCount,
      };

      resolve({ result });
    });
  }
}
