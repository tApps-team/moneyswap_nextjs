import { ExchangerMarker, Name } from "@/shared/types";
import { CryptoExchanger, CryptoExchangerBlackList, CryptoExchangerBlackListDetails, Exchanger, ExchangerInfo } from "../model/types/exchanger-type";

export type GetExchangersDtoRequest = {
  city?: string;
  valute_from: string;
  valute_to: string;
};
export type GetExchangersDtoResponse = Exchanger[];
export type GetSimilarDirectionDtoRequset = {
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

export type GetExchangeListDtoResponse = CryptoExchanger[];
export type GetExchangeListDtoRequest = {};

export type GetExchnagerDetailDtoResponse = ExchangerInfo;
export type GetExchnagerDetailDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
};

export type GetBlackListDtoResponse = CryptoExchangerBlackList[];
export type GetBlackListDtoRequest = {};

export type GetBlackListDetailDtoResponse = CryptoExchangerBlackListDetails;
export type GetBlackListDetailDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
};

export type GetSitemapDirectionsDtoResponse = {
  page: number;
  pages: number;
  element_on_page: number;
  directions: {
    valute_from: string;
    valute_to: string;
    exchange_marker: ExchangerMarker;
    city: string | null;
  }[];
};
export type GetSitemapDirectionsDtoRequest = {
  page: number;
  element_on_page?: number;
};
