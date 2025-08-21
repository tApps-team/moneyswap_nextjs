// eslint-disable-next-line boundaries/element-types
import { LocationInfo } from "@/entities/location";
import { ExchangerMarker, ExchangerStatus, Name, Review } from "@/shared/types";

export interface Exchanger {
  id: number;
  name: Name;
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  is_vip: boolean;
  partner_link: string;
  valute_from: string;
  icon_valute_from: string;
  valute_to: string;
  icon_valute_to: string;
  in_count: number;
  out_count: number;
  min_amount: string | null;
  max_amount: string | null;
  review_count: {
    positive: number;
    neutral: number;
    negative: number;
  };
  info: {
    bankomats?: Bankomat[] | null;
    delivery?: boolean;
    office?: boolean;
    working_days?: {
      Пн: boolean;
      Вт: boolean;
      Ср: boolean;
      Чт: boolean;
      Пт: boolean;
      Сб: boolean;
      Вс: boolean;
    };
    weekdays?: { time_from: string; time_to: string };
    weekends?: { time_from: string; time_to: string };
    high_aml?: boolean;
  };
  params?: string;
  fromfee?: number | null;
  exchange_direction_id: number;
  exchange_rates: ExchangeRate[] | null;
  direction_marker: DirectionMarker;
  location?: LocationInfo;
}

export enum DirectionMarker {
  city = "city",
  country = "country",
  no_cash = "no_cash",
}

export interface Bankomat {
  id: number;
  available: boolean;
  name: string;
  icon: string;
}

export type CryptoExchanger = {
  id: number;
  exchangerName: string;
  exchange_marker: ExchangerMarker;
  workStatus: boolean;
  reserves: string;
  courses: string;
  url: string;
  reviews: Review;
};

export type CryptoExchangerBlackList = {
  id: number;
  name: {
    ru: string;
    en: string;
  };
  exchange_marker: ExchangerStatus.scam;
  url: string;
}

export type ExchangerInfo = {
  name: string;
  iconUrl: string;
  workStatus: Exclude<ExchangerStatus, ExchangerStatus.scam>;
  reviews: Review;
  country: string;
  amountReserves: string;
  exchangeRates: number;
  open: string;
  openOnMoneySwap: string;
  url: string;
  high_aml: boolean;
};

export type ExchangeRate = {
  min_count: number | null;
  max_count: number | null;
  in_count: number;
  out_count: number;
  rate_coefficient: number;
};