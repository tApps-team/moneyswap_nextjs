// eslint-disable-next-line boundaries/element-types
import { SegmentMarker } from "@/shared/types";
import {
  CurrencyPair,
  CurrencyResponse,
  Currency,
} from "../model/types/currencyType";

export type GetAvailableValutesDtoResponse = CurrencyResponse[];
export type GetAvailableValutesDtoRequest = {
  city?: string | null;
  base?: string;
};

export type GetSpecificValuteResponse = Currency;
export type GetSpecificValuteRequest = {
  codeName: string;
};

//popular and random directions
export type GetDirectionsRequest = {
  segment_marker: SegmentMarker;
  limit: number;
};
export type GetDirectionsResponse = {
  valute_from: Currency;
  valute_to: Currency;
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
};
export type GetPairValuteDtoResponse = CurrencyPair[];
