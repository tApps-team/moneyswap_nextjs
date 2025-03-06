import { ExchangerMarker, Name } from "@/shared/types";

export type Currency = {
  id: string;
  name: Name;
  code_name: string;
  icon_url: string;
  is_popular: boolean;
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
  valuteFrom: Omit<Currency, "id">;
  valuteTo: Omit<Currency, "id">;
  pairCount: number;
  direction_type: ExchangerMarker;
};

export type SpecificValute = {
  name: Name;
  code_name: string;
  icon_url: string;
  type_valute: Name;
  is_popular: boolean;
};
