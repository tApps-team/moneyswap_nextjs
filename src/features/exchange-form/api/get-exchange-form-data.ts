import { cache } from "react";
import { getActualCourse, getAvailableValutes, getSpecificValute } from "@/entities/currency";
import { getCountries, getSpecificCity } from "@/entities/location";
import { SegmentMarker } from "@/shared/types";

export type ExchangeDirection = Omit<SegmentMarker, SegmentMarker.both>;

/**
 * Направление обмена из адреса: явный ?direction=cash либо выбранный город,
 * который сам по себе означает наличный обмен.
 */
export const resolveExchangeDirection = (searchParams?: {
  direction?: string;
  city?: string;
}): SegmentMarker.cash | SegmentMarker.no_cash =>
  searchParams?.city || searchParams?.direction === "cash"
    ? SegmentMarker.cash
    : SegmentMarker.no_cash;

/**
 * Пара валют по умолчанию и её курс: SBERRUB→BTC, для наличных CASHRUB→BTC.
 *
 * Город берём только когда он есть в адресе: дефолтный «msk» разошёлся бы с URL.
 */
export const getExchangePair = cache(async (direction: ExchangeDirection, city?: string) => {
  const giveCode = direction === SegmentMarker.cash ? "cashrub" : "sberrub";

  const [giveCurrency, getCurrency, actualCourse, location] = await Promise.all([
    getSpecificValute({ codeName: giveCode }),
    getSpecificValute({ codeName: "btc" }),
    getActualCourse({ valuteFrom: giveCode, valuteTo: "btc" }),
    direction === SegmentMarker.cash && city
      ? getSpecificCity({ codeName: city })
      : Promise.resolve(null),
  ]);

  return { giveCurrency, getCurrency, actualCourse, location };
});

/**
 * Списки для селектов формы: страны и доступные валюты.
 *
 * Отдельно от пары, чтобы страница обмена могла запросить их параллельно
 * с самими обменниками, а не после.
 */
export const getExchangeFormOptions = cache(
  async (giveCurrencyCode?: string, cityCode?: string) => {
    const [countries, giveCurrencies, getCurrencies] = await Promise.all([
      getCountries(),
      getAvailableValutes({ base: "all", city: cityCode }),
      getAvailableValutes({ base: giveCurrencyCode, city: cityCode }),
    ]);

    return { countries, giveCurrencies, getCurrencies };
  },
);
