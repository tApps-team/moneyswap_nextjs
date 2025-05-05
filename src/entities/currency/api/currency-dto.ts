//TODO Исправить импорт
// eslint-disable-next-line boundaries/element-types
import { ExchangerMarker } from "@/shared/types";
import {
  CurrencyPair,
  CurrencyResponse,
  ExchangeType,
  SpecificValute,
} from "../model/types/currencyType";

export type GetAvailableValutesDtoResponse = CurrencyResponse[];
export type GetAvailableValutesDtoRequest = {
  city?: string | null;
  base?: string;
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

export type GetActualCourseDtoResponse = {
  valute_from: string;
  icon_valute_from: string;
  in_count: number;
  valute_to: string;
  icon_valute_to: string;
  out_count: number;
};
export type GetActualCourseDtoRequest = {
  valuteFrom: string;
  valuteTo: string;
};

export type GetPairValuteDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
};
export type GetPairValuteDtoResponse = CurrencyPair[];
