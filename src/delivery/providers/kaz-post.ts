import { IDeliveryProvider } from '../interfaces/delivery-provider.interface';
import { IDeliveryPrice } from '../interfaces/delivery-price.interface';
import { DEFAULT_CURRENCY } from '../../constants/order';
import { DeliveryDTO } from '../dto/delivery.dto';
import { EXTRA_PACKAGE, KAZ_POST_PRICE } from '../../constants/delivery';

export class KazPostProvider implements IDeliveryProvider {
  async getPrice(deliveryDTO: DeliveryDTO): Promise<IDeliveryPrice> {
    return new Promise((resolve) => {
      const packagesCount = Math.ceil(
        parseInt(deliveryDTO.quantity, 10) / EXTRA_PACKAGE.ITEMS_COUNT,
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
