import { Name } from "@/shared/types";
import { CurrencyResponse } from "../model/types/currencyType";

export type GetAvailableValutesDtoResponse = CurrencyResponse[];
export type GetAvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};

export type GetSpecificValuteResponse = {
  name: Name;
  code_name: string;
  icon_url: string;
  type_valute: {
    ru: string;
    en: string;
  };
};
export type GetSpecificValuteRequest = {
  codeName: string;
};
