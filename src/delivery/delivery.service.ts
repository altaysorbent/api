import { DeliveryDTO } from './dto/delivery.dto';
import { Injectable } from '@nestjs/common';
import { DELIVERY_COMPANIES } from '../constants/delivery';
import { CitiesByCountryCodeDto } from './dto/cities-by-country-code.dto';
import { CDEKService } from '../cdek/cdek.service';
import { KazPostService } from '../kaz-post/kaz-post.service';
import { PostCodesByCityCodeDto } from './dto/post-codes-by-city-code.dto';

@Injectable()
export class DeliveryService {
  constructor(
    private cdekService: CDEKService,
    private kazPostService: KazPostService,
  ) {}

  async getPrice(deliveryDto: DeliveryDTO) {
    if (deliveryDto.deliveryCompany === DELIVERY_COMPANIES.KAZPOST) {
      return this.kazPostService.getPrice(deliveryDto);
    } else {
      return this.cdekService.calculate({
        code: deliveryDto.receiverCityId,
        postal_code: deliveryDto.zip,
        address: deliveryDto.address,
        quantity: deliveryDto.quantity,
        tariff_code: deliveryDto.tariffId,
      });
    }
  }

  async getCitiesByCountryCode(dto: CitiesByCountryCodeDto) {
    return this.cdekService.getCityListByCountryCode(dto.country);
  }

  async getPostCodesByCityCode(dto: PostCodesByCityCodeDto) {
    return this.cdekService.getPostCodesByCityCode(dto.code);
  }
}
