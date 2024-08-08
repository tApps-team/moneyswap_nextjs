import { Name } from "@/shared/types";
import { CurrencyResponse, ExchangeType } from "../model/types/currencyType";

export type GetAvailableValutesDtoResponse = CurrencyResponse[];
export type GetAvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};

export type SpecificValute = {
  name: Name;
  code_name: string;
  icon_url: string;
  type_valute: Name;
};

export type GetSpecificValuteResponse = SpecificValute;
export type GetSpecificValuteRequest = {
  codeName: string;
};

//popular and random directions
export type GetDirectionsRequest = {
  exchange_marker: ExchangeType;
  limit: number;
};

export type GetDirectionsResponse = {
  valute_from: SpecificValute;
  valute_to: SpecificValute;
}[];
