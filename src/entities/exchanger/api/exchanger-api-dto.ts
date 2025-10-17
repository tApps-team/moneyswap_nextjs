// eslint-disable-next-line boundaries/element-types
import { Currency } from "@/entities/currency";
import { CryptoExchanger, CryptoExchangerBlackList, CryptoExchangerBlackListDetails, Exchanger, ExchangerDetail } from "../model/types/exchanger-type";

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
  valute_from: Currency;
  valute_to: Currency;
}[];

export type GetExchangeListDtoResponse = CryptoExchanger[];
export type GetExchangeListDtoRequest = {};

export type GetExchnagerDetailDtoResponse = ExchangerDetail;
export type GetExchnagerDetailDtoRequest = {
  exchange_id: number;
};

export type GetBlackListDtoResponse = CryptoExchangerBlackList[];
export type GetBlackListDtoRequest = {};

export type GetBlackListDetailDtoResponse = CryptoExchangerBlackListDetails;
export type GetBlackListDetailDtoRequest = {
  exchange_id: number;
};

export type GetSitemapDirectionsDtoResponse = {
  page: number;
  pages: number;
  element_on_page: number;
  directions: {
    valute_from: string;
    valute_to: string;
    direction_marker: "cash" | "no_cash";
    city: string | null;
  }[];
};
export type GetSitemapDirectionsDtoRequest = {
  page: number;
  element_on_page?: number;
};
