import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IGood } from '../delivery/interfaces/good.interface';
import { add, format } from 'date-fns';
import { createHash } from 'crypto';
import { DeliveryDTO } from '../delivery/dto/delivery.dto';
import { IDeliveryPrice } from '../delivery/interfaces/delivery-price.interface';
import {
  EXTRA_PACKAGE,
  PACKAGE_HEIGHT,
  PACKAGE_LENGTH,
  PACKAGE_WEIGHT,
  PACKAGE_WIDTH,
  SENDER_CITY_IDS,
} from '../constants/delivery';
import { IDeliveryProvider } from '../delivery/interfaces/delivery-provider.interface';
import { CDEK_API_INSTANCE_TOKEN } from '../api/cdek/cdekapi.constants';
import { AxiosInstance } from 'axios';
import { CalculateDto } from './dto/calculate.dto';

@Injectable()
export class CDEKService implements IDeliveryProvider {
  constructor(
    private httpService: HttpService,
    @Inject(CDEK_API_INSTANCE_TOKEN) private readonly cdekApi: AxiosInstance,
  ) {}
  private prepareGoods(count = 1): IGood[] {
    const goods: IGood[] = [];
    goods.push({
      weight: 2 * count,
      length: 21,
      width: 5 * count,
      height: 30,
    });

    return goods;
  }

  private prepareRequestBodyForGoods(deliveryDto, goods) {
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

  /**
   * @deprecated consider {@link calculate} method instead
   * @param deliveryDTO
   */
  async getPrice(deliveryDTO: DeliveryDTO): Promise<IDeliveryPrice> {
    const goods = this.prepareGoods(+deliveryDTO.quantity);
    const requestBody = this.prepareRequestBodyForGoods(deliveryDTO, goods);

    return this.httpService
      .post(process.env.CDEK_DELIVERY_PRICE_URL, requestBody)
      .toPromise()
      .then(({ data }) => {
        if ('result' in data) {
          data.result.priceByCurrency = parseFloat(data.result.priceByCurrency);
          data.result.price = parseFloat(data.result.price);

          if (deliveryDTO.quantity > EXTRA_PACKAGE.ITEMS_COUNT) {
            data.result.priceByCurrency += EXTRA_PACKAGE.PRICE_KZT;
            data.result.price += EXTRA_PACKAGE.PRICE;
          }
        }

        return data;
      });
  }

  async getCityListByCountryCode(country_code: string = 'RU') {
    return this.cdekApi
      .get(`/location/cities?lang=RU&page=0&country_codes=${country_code}`)
      .then((res) => res.data)
      .catch((e) => {
        throw new HttpException(e.response.data, e.response.status);
      });
  }

  async getPostCodesByCityCode(code: number) {
    return this.cdekApi
      .get(`/location/postalcodes?code=${code}`)
      .then((res) => res.data)
      .catch((e) => {
        throw new HttpException(e.response.data, e.response.status);
      });
  }

  async calculate({
    code,
    postal_code,
    address,
    quantity,
    tariff_code,
  }: CalculateDto) {
    const dateExecute = format(
      add(new Date(), {
        days: 1,
      }),
      "yyyy-MM-dd'T'HH:mm:ssxxxx",
    );

    return this.cdekApi
      .post('/calculator/tariff', {
        date: dateExecute,
        tariff_code,
        from_location: {
          code: SENDER_CITY_IDS[0],
        },
        to_location: {
          code,
          postal_code,
          address,
        },
        packages: Array.from(Array(quantity)).map(() => ({
          weight: PACKAGE_WEIGHT,
          length: PACKAGE_LENGTH,
          width: PACKAGE_WIDTH,
          height: PACKAGE_HEIGHT,
        })),
      })
      .then((res) => res.data)
      .catch((e) => {
        throw new HttpException(e.response.data, e.response.status);
      });
  }
}
