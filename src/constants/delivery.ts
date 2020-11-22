const EXTRA_PACKAGE = {
  ITEMS_COUNT: 32,
  PRICE_KZT: 290,
  PRICE: 50,
};

const TARIFF_IDS = [137, 136];
const SENDER_CITY_IDS = [11903, 137];

const TARIFFS = {
  [TARIFF_IDS[0]]: 'Доставка до квартиры',
  [TARIFF_IDS[1]]: 'Заберу со склада',
};

const SENDER_CITIES = {
  [SENDER_CITY_IDS[0]]: 'Усть-Каменогорск',
  [SENDER_CITY_IDS[1]]: 'Санкт-Петербург',
};


export {
  EXTRA_PACKAGE,
  TARIFFS,
  SENDER_CITIES,
  TARIFF_IDS,
  SENDER_CITY_IDS,
};
