import { SegmentMarker, Name } from "@/shared/types";

// Базовый тип Currency с всеми возможными полями
export type Currency = {
  id: string | number; // может быть string или number в зависимости от контекста
  name: Name;
  code_name: string;
  icon_url: string;
  is_popular?: boolean; // опциональное поле
  type_valute?: string; // опциональное поле для SpecificValute
};

export type CurrencyResponse = {
  id: number | string;
  name: Name;
  currencies: Currency[];
};

export type CurrencyPair = {
  valuteFrom: Omit<Currency, "is_popular" | "type_valute">;
  valuteTo: Omit<Currency, "is_popular" | "type_valute">;
  pairCount: number;
  direction_type: Omit<SegmentMarker, SegmentMarker.both>;
};

// Алиасы для обратной совместимости
export type SpecificValute = Currency;
