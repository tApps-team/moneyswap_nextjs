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
  main = "main",
  exchange_cash = "exchange_cash",
  exchange_noncash = "exchange_noncash",
  sell_cash = "sell_cash",
  sell_noncash = "sell_noncash",
  buy_cash = "buy_cash",
  buy_noncash = "buy_noncash",
}
