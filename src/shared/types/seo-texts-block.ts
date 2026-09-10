export interface SeoTextsBlock {
  data: {
    id: number;
    header_title: string;
    header_description: string;
    footer_title: string;
    footer_description: string;
    page: pageTypes;
  }[];
}

export enum pageTypes {
  /** Обменная витрина /exchange — исторически заведена в Strapi как «main». */
  main = "main",
  /**
   * Главная-витрина. Ключ старше удаления /ratings — за ним стоит живой контент
   * в Strapi, поэтому переименовывать его не стали.
   */
  ratings_main = "ratings_main",
  /** Хабы групп. Значения нужно завести в Strapi; до тех пор работают фолбэки. */
  crypto_services = "crypto_services",
  abroad_services = "abroad_services",
  cards_services = "cards_services",
  exchange_cash = "exchange_cash",
  exchange_noncash = "exchange_noncash",
  sell_cash = "sell_cash",
  sell_noncash = "sell_noncash",
  buy_cash = "buy_cash",
  buy_noncash = "buy_noncash",
}
