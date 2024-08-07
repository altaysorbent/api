import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OrderDTO } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, TOrderDocument } from './schemas/order';
import { Model } from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { map } from 'rxjs/operators';
import {
  DEFAULT_CURRENCY,
  ORDER_RESULT_ENDPOINT_URL,
  ORDER_STATUSES,
  PAYBOX_REDIRECT_URL_KEY,
  PAYBOX_RESPONSE_STATUSES,
  PAYBOX_SUCCESS_RESULT_CODE,
} from '../constants/order';
import { formatISO } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import { IPayboxResponse } from './interfaces/paybox/response.interface';
import {
  DELIVERY_COMPANIES,
  SENDER_CITIES,
  TARIFFS,
} from '../constants/delivery';
import { PayboxResultDTO } from './dto/paybox-result.dto';
import { xml2js } from 'xml-js';

const EmailTemplates = {
  NEW_ORDER: 'newOrder',
  ORDER_PAID: 'orderPaid',
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<TOrderDocument>,
    private httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {}

  payboxSignData(url, data): string {
    const secretKey = process.env.PAYBOX_SECRET;

    const items = [url];

    Object.keys(data)
      .sort()
      .map(function (key) {
        items.push(data[key]);
        return data[key];
      });

    items.push(secretKey);
    const joined = items.join(';');

    return createHash('md5').update(joined).digest('hex');
  }

  prepareSalesEmail(paymentData, orderData) {
    const { tariffId, senderCityId } = orderData.delivery;
    const tariff = TARIFFS[tariffId] || 'Не указано (ошибка)';

    const senderCity = SENDER_CITIES[senderCityId] || 'Не указано (ошибка)';

    const orderId = orderData.id;
    return {
      title: `Новый заказ №${orderId}`,
      orderId,
      ...orderData.customer,
      totalPrice: orderData.totalPrice,
      count: orderData.product.count,
      productTotal: orderData.product.total,
      price: orderData.product.price,
      creationDate: orderData.createdAt,
      delivery: {
        ...orderData.delivery,
        isCDEKCompany: orderData.delivery.company === DELIVERY_COMPANIES.CDEK,
      },
      tariff,
      senderCity,
      allParams: JSON.stringify({ ...orderData, ...paymentData }),
    };
  }

  async salesNotify(
    context,
    subject = null,
    template = EmailTemplates.NEW_ORDER,
  ) {
    return this.mailerService
      .sendMail({
        to: process.env.MAIL_TO,
        subject: subject || `Новый заказ №${context.orderId}`,
        template,
        context,
      })
      .catch((err) => {
        console.log('Error during email sending', err);
      });
  }

  generateSalt() {
    return randomBytes(20).toString('hex');
  }

  calculateTotalPrice(orderDTO: OrderDTO) {
    return (
      orderDTO.product.count * orderDTO.product.price + orderDTO.delivery.price
    );
  }

  preparePaymentData(orderDTO: OrderDTO, orderId, totalPrice) {
    const description = `Оплата заказа №${orderId} на сайте Altaysorbent.org на сумму ${totalPrice}`;

    const paymentData = {
      pg_merchant_id: process.env.PAYBOX_MERCHANT_ID,
      pg_order_id: `${orderId}`,
      pg_amount: totalPrice,
      pg_currency: DEFAULT_CURRENCY,
      pg_lifetime: 86400,
      pg_description: description,
      pg_success_url:
        process.env.WEBSITE_URL + '/order-confirmation?m=' + orderId,
      pg_result_url: process.env.API_URL + ORDER_RESULT_ENDPOINT_URL,
      pg_testing_mode: process.env.TESTING_MODE,
      pg_salt: this.generateSalt(),

      pg_user_phone: orderDTO.customer.phone,
      pg_user_contact_email: orderDTO.customer.email,
      pg_request_method: 'POST',
    };

    return paymentData;
  }

  async createOrder(orderDTO: OrderDTO) {
    const totalPrice = this.calculateTotalPrice(orderDTO);

    const newOrder = {
      ...orderDTO,
      status: ORDER_STATUSES.NEW,
      createdAt: formatISO(new Date()),
      totalPrice,
    };
    const createdOrder = new this.orderModel(newOrder);
    const { id: orderId } = await createdOrder.save();

    const paymentData = this.preparePaymentData(orderDTO, orderId, totalPrice);

    const paymentSignature = this.payboxSignData(
      process.env.PAYBOX_PAYMENT_SCRIPT,
      paymentData,
    );

    const payboxMeta = { ...paymentData, pg_sig: paymentSignature };

    await this.orderModel.updateOne({ id: orderId }, { meta: payboxMeta });

    return this.httpService
      .post(
        `${process.env.PAYBOX_PAYMENT_URL}/${process.env.PAYBOX_PAYMENT_SCRIPT}`,
        payboxMeta,
      )
      .pipe(
        map((response) => {
          const result = xml2js(response.data);
          const pgRedirectUrlElement = result.elements[0].elements.find(
            (element) => element.name === PAYBOX_REDIRECT_URL_KEY,
          );

          if (!pgRedirectUrlElement?.elements?.length) {
            throw new BadRequestException(response.data);
          }

          this.salesNotify(this.prepareSalesEmail(paymentData, createdOrder));

          return {
            redirectUrl: pgRedirectUrlElement.elements.pop().text,
            id: createdOrder.id,
          };
        }),
      );
  }

  async processResult(result: PayboxResultDTO, endpointUrl) {
    const orderId = result.pg_order_id;
    const order = await this.orderModel.findOne({ id: orderId }).exec();
    let responseText = '';
    let responseStatus;
    if (!order) {
      responseText = `Could not find order with number: ${orderId}`;
    } else if (+result.pg_amount !== +order.totalPrice) {
      responseText = 'Неверная сумма';
    } else {
      let newOrderStatus;
      let title;
      if (result.pg_result === PAYBOX_SUCCESS_RESULT_CODE) {
        newOrderStatus = ORDER_STATUSES.PAID;
        title = `Оплата по заказу №${orderId}`;
        responseStatus = PAYBOX_RESPONSE_STATUSES.SUCCESS;
      } else {
        newOrderStatus = ORDER_STATUSES.CANCELED;
        title = `Заказ №${orderId} отменен`;
      }

      if (newOrderStatus !== order.status) {
        const context = {
          title,
          orderId,
          phone: result.pg_user_phone,
          amount: result.pg_amount,
          paymentSystem: result.pg_payment_system,
          payboxPaymentId: result.pg_payment_id,
          payboxCardNumber: result.pg_card_pan,
          allParams: JSON.stringify(result),
        };

        this.salesNotify(context, title, EmailTemplates.ORDER_PAID);

        await this.orderModel.updateOne(
          { id: orderId },
          { status: newOrderStatus },
        );
      }
    }

    if (responseStatus !== PAYBOX_RESPONSE_STATUSES.SUCCESS) {
      if (result.pg_can_reject) {
        responseStatus = PAYBOX_RESPONSE_STATUSES.REJECTED;
      } else {
        responseStatus = PAYBOX_RESPONSE_STATUSES.ERROR;
      }
    }

    const response: IPayboxResponse = {
      pg_salt: result.pg_salt,
      pg_status: responseStatus,
      pg_description: responseText,
    };

    response.pg_sig = this.payboxSignData(endpointUrl, response);

    return response;
  }
}
