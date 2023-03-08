interface IError {
  code: number;
  text: string;
}
export interface IDeliveryPrice {
  result?: {
    currency: string;
    deliveryDateMax?: string; //'2022-01-07'
    deliveryDateMin?: string; // '2022-01-06'
    deliveryPeriodMax?: number;
    deliveryPeriodMin?: number;
    price: number;
    priceByCurrency: number;
    tariffId?: number;
  };
  error?: IError[];
}
