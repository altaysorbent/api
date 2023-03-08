import { DeliveryDTO } from './dto/delivery.dto';
import { CdekProvider } from './providers/cdek';
import { HttpService, Injectable } from '@nestjs/common';
import { DELIVERY_COMPANIES } from '../constants/delivery';
import { KazPostProvider } from './providers/kaz-post';
import { IDeliveryProvider } from './interfaces/delivery-provider.interface';

@Injectable()
export class DeliveryService {
  constructor(private httpService: HttpService) {}
  private deliveryProvider: IDeliveryProvider;

  async getPrice(deliveryDto: DeliveryDTO) {
    switch (deliveryDto.deliveryCompany) {
      case DELIVERY_COMPANIES.KAZPOST:
        this.deliveryProvider = new KazPostProvider();
        break;
      case DELIVERY_COMPANIES.CDEK:
      default:
        this.deliveryProvider = new CdekProvider(this.httpService);
        break;
    }

    return this.deliveryProvider.getPrice(deliveryDto);
  }
}
