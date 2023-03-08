import { IDeliveryPrice } from './delivery-price.interface';
import { DeliveryDTO } from '../dto/delivery.dto';

export interface IDeliveryProvider {
  getPrice(deliveryDTO?: DeliveryDTO): Promise<IDeliveryPrice>;
}
