import { Name, Review } from "@/shared/types";
import { Exchanger, ExchangerMarker, ExchnagerInfo } from "../model/types/exchanger-type";

export type GetExchangersDtoRequest = {
  city?: string;
  valute_from: string;
  valute_to: string;
};
export type GetExchangersDtoResponse = Exchanger[];
//вынести в отдельный enum/type "no_cash" | "cash"
export type GetSimilarDirectionDtoRequset = {
  exchangeMarker?: "no_cash" | "cash";
  valuteFrom: string;
  valuteTo: string;
  city?: string;
  limit?: number;
};
export type GetSimilarDirectionDtoResponse = {
  valute_from: {
    name: Name;
    code_name: string;
    icon_url: string;
    type_valute: Name;
  };
  valute_to: {
    name: Name;
    code_name: string;
    icon_url: string;
    type_valute: Name;
  };
}[];

export type GetExchangeListDtoResponse = {
  id: number;
  exchangerName: string;
  exchange_marker: string;
  workStatus: boolean;
  reserves: string;
  courses: string;
  url: string;
  reviews: Review;
}[];
export type GetExchangeListDtoRequest = {};

export type GetExchnagerDetailDtoResponse = ExchnagerInfo;
export type GetExchnagerDetailDtoRequset = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
};
