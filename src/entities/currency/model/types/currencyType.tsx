import { ExchangerMarker, Name } from "@/shared/types";

export type Currency = {
  id: string;
  name: Name;
  code_name: string;
  icon_url: string;
};
export type CurrencyResponse = {
  id: string;
  name: Name;
  currencies: Currency[];
};

export enum ExchangeType {
  cash = "cash",
  no_cash = "no_cash",
}

export type CurrencyPair = {
  valuteFrom: Currency;
  valuteTo: Currency;
  pairCount: number;
  direction_type: ExchangerMarker;
};
