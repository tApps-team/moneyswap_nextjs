import { Name } from "@/shared/types";
import { Exchanger } from "../model/types/exchanger-type";

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
