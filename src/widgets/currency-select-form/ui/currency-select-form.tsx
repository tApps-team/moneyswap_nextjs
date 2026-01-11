"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CurrencySwitcher } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency as SpecificValute, GetAvailableValutesDtoResponse } from "@/entities/currency";
import { Country, LocationInfo } from "@/entities/location";
import { useYandexMetrika } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { SegmentMarker } from "@/shared/types";

const CurrencySelectMobile = dynamic(() =>
  import("@/features/currency").then((mod) => mod.CurrencySelectMobile),
);
const CurrencySelect = dynamic(() =>
  import("@/features/currency").then((mod) => mod.CurrencySelect),
);

type ActualCourse = {
  valute_from: string;
  icon_valute_from: string;
  in_count: number;
  valute_to: string;
  icon_valute_to: string;
  out_count: number;
};

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: LocationInfo;
  urlGetCurrency?: SpecificValute;
  urlGiveCurrency?: SpecificValute;
  urlDirection: Exclude<SegmentMarker, SegmentMarker.both>;
  actualCourse: ActualCourse | null;
  countries: Country[];
  giveCurrencies: GetAvailableValutesDtoResponse;
  getCurrencies: GetAvailableValutesDtoResponse;
};

export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
  const { urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse, countries, giveCurrencies, getCurrencies } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [giveAmount, setGiveAmount] = useState<number>(actualCourse?.in_count || 0);
  const [getAmount, setGetAmount] = useState<number>(actualCourse?.out_count || 0);

  const handleAmountChange = (value: number, type: "give" | "get") => {
    const newValue = Number(value.toFixed(3));
    
    if (type === "give") {
      setGiveAmount(newValue);
      if (actualCourse?.in_count && actualCourse?.out_count) {
        const rate = actualCourse.out_count / actualCourse.in_count;
        setGetAmount(Number((value * rate).toFixed(3)));
      }
      // Отправляем событие что изменился give (in_count)
      window.dispatchEvent(new CustomEvent('amountChange', { 
        detail: { value: newValue, type: 'give' }
      }));
    } else {
      setGetAmount(newValue);
      if (actualCourse?.in_count && actualCourse?.out_count) {
        const rate = actualCourse.out_count / actualCourse.in_count;
        setGiveAmount(Number((value / rate).toFixed(3)));
      }
      // Отправляем событие что изменился get (out_count)
      window.dispatchEvent(new CustomEvent('amountChange', { 
        detail: { value: newValue, type: 'get' }
      }));
    }
  };

  useEffect(() => {
    if (actualCourse?.in_count && actualCourse?.out_count) {
      setGiveAmount(actualCourse.in_count);
      setGetAmount(actualCourse.out_count);
    }
  }, [actualCourse]);

  const onCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const isGetCurrencyDisabled = !getCurrencies || getCurrencies.length === 0;

  const { selectTypeCashless, selectTypeCash } = useYandexMetrika();

  return (
    <section className="h-fit">
      <form
        className={cn(
          "grid grid-rows-[auto,1fr] text-white w-full border-light-gray h-full lg:pb-10 lg:py-6 lg:px-7 md:p-8 md:py-3 md:px-5 md:pb-4 p-4 mobile-xl:pb-[30px] pb-5 bg-new-dark-grey rounded-[15px]",
          isCollapsed ? "gap-3" : "md:gap-5 gap-6",
        )}
      >
        <div className="flex md:flex-row flex-col lg:gap-2 md:gap-4 gap-0 md:items-center justify-between">
          <p
            className={cn(
              "uppercase hidden md:block lg:text-xl md:text-lg font-semibold",
              isCollapsed && "hidden",
            )}
          >
            Выберите направление обмена
          </p>
          <div className="flex flex-col mobile-xs:flex-row justify-center md:justify-between mobile-xs:gap-0 items-start mobile-xs:items-center">
            <div className="grid grid-cols-2 gap-2 items-center w-full md:gap-2">
              <Link
                href={"/"}
                type="button"
                role="tab"
                id="changeOnline"
                className={cn(
                  "p-0 mobile-xl:text-base text-sm text-center h-full mobile-xl:px-7 px-2 py-4 bg-new-light-grey text-white font-semibold rounded-[10px]",
                  urlDirection === SegmentMarker.no_cash && " bg-yellow-main text-black",
                )}
                onClick={() => {
                  selectTypeCashless();
                }}
              >
                Безналичные
              </Link>

              <Link
                href={`/?direction=cash`}
                type="button"
                role="tab"
                id="changeCash"
                className={cn(
                  " p-0 mobile-xl:text-base text-sm text-center h-full mobile-xl:px-7 px-2 py-4 bg-new-light-grey text-white font-semibold rounded-[10px]",
                  urlDirection === SegmentMarker.cash && " bg-yellow-main text-black",
                )}
                onClick={() => {
                  selectTypeCash();
                }}
              >
                Наличные
              </Link>
            </div>
          </div>
        </div>
        {urlDirection === SegmentMarker.cash && <LocationSelect countries={countries || []} cityInfo={urlLocation} />}
        {!isDesktop ? (
          <div
            className={cn(
              "",
              !isCollapsed
                ? "flex-col flex items-center gap-4"
                : "grid grid-cols-[1fr,auto,1fr] bg-new-grey py-3 px-4 rounded-[10px] gap-1",
            )}
          >
            <CurrencySelectMobile
              isCollapsed={isCollapsed}
              actualCourse={giveAmount}
              disabled={
                !giveCurrencies ||
                giveCurrencies.length === 0 ||
                (urlDirection === SegmentMarker.cash && !urlLocation)
              }
              currencyInfoGive={urlGiveCurrency}
              currencyInfoGet={urlGetCurrency}
              currencies={giveCurrencies}
              direction={urlDirection}
              location_code_name={urlLocation?.code_name || undefined}
              label="отдаю"
              type="give"
              onAmountChange={handleAmountChange}
            />
            {!isCollapsed && <CurrencySwitcher direction={urlDirection} />}
            {isCollapsed && (
              <span className="w-[1px] h-full rounded-xl bg-[#5F5F5F] my-1 mr-1 ml-0.5"></span>
            )}
            <CurrencySelectMobile
              isCollapsed={isCollapsed}
              actualCourse={getAmount}
              currencyInfoGive={urlGiveCurrency}
              currencyInfoGet={urlGetCurrency}
              disabled={isGetCurrencyDisabled}
              currencies={getCurrencies}
              direction={urlDirection}
              location_code_name={urlLocation?.code_name || undefined}
              label="получаю"
              type="get"
              onAmountChange={handleAmountChange}
            />
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 items-center justify-between lg:grid-cols-[1fr,auto,1fr]  lg:items-center lg:justify-center w-full gap-4",
            )}
          >
            <CurrencySelect
              actualCourse={giveAmount}
              disabled={
                !giveCurrencies ||
                giveCurrencies.length === 0 ||
                (urlDirection === SegmentMarker.cash && !urlLocation)
              }
              currencyInfoGive={urlGiveCurrency}
              currencyInfoGet={urlGetCurrency}
              currencies={giveCurrencies}
              direction={urlDirection}
              location_code_name={urlLocation?.code_name || undefined}
              label="отдаю"
              type="give"
              onAmountChange={handleAmountChange}
            />

            <CurrencySwitcher direction={urlDirection} />

            <CurrencySelect
              actualCourse={getAmount}
              currencyInfoGive={urlGiveCurrency}
              currencyInfoGet={urlGetCurrency}
              disabled={isGetCurrencyDisabled}
              currencies={getCurrencies}
              direction={urlDirection}
              location_code_name={urlLocation?.code_name || undefined}
              label="получаю"
              type="get"
              onAmountChange={handleAmountChange}
            />
          </div>
        )}
      </form>
      <button
        onClick={onCollapse}
        className=" md:hidden flex items-center justify-center rounded-[6px] mx-auto bg-yellow-main -translate-y-3 w-1/4"
      >
        {isCollapsed ? <ChevronDown color="black" /> : <ChevronUp color="black" />}
      </button>
    </section>
  );
};
