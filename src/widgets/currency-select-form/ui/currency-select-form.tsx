"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { CurrencySwitcher } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, SpecificValute, useGetAvailableValutes } from "@/entities/currency";
import { LocationInfo, useGetCountries } from "@/entities/location";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { ExchangerMarker } from "@/shared/types";

const CurrencySelectMobile = dynamic(() =>
  import("@/features/currency").then((mod) => mod.CurrencySelectMobile),
);
const CurrencySelect = dynamic(() =>
  import("@/features/currency").then((mod) => mod.CurrencySelect),
);

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: LocationInfo;
  urlGetCurrency?: SpecificValute;
  urlGiveCurrency?: SpecificValute;
  urlDirection: ExchangerMarker;
  actualCourse: number | null;
};

export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
  const { urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse } = props;
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const onCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };
  const onClickGetCurrency = (getCurrency: Currency) => {
    const route =
      urlDirection === ExchangerMarker.cash
        ? `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}?city=${urlLocation?.code_name}`
        : `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}`;

    router.push(route);
  };

  const onClickGiveCurrency = (giveCurrency: Currency) => {
    const route =
      urlDirection === ExchangerMarker.cash
        ? `/exchange/${giveCurrency.code_name}-to-${urlGetCurrency?.code_name}?city=${urlLocation?.code_name}`
        : `/exchange/${giveCurrency.code_name}-to-${urlGetCurrency?.code_name}`;

    router.push(route);
  };

  const { data: countries } = useGetCountries(urlDirection);

  const {
    data: giveCurrencies,
    isLoading: giveCurrenciesIsLoading,
    isError: giveCurrenciesIsError,
  } = useGetAvailableValutes({
    base: "all",
    city: urlDirection === ExchangerMarker.cash ? urlLocation?.code_name : undefined,
  });

  const {
    data: getCurrencies,
    isLoading: getCurrenciesIsLoading,
    isError: getCurrenciesIsError,
    error: getError,
  } = useGetAvailableValutes({
    base: urlGiveCurrency?.code_name,
    city: urlDirection === ExchangerMarker.cash ? urlLocation?.code_name : undefined,
  });

  const isGetCurrencyDisabled = getCurrenciesIsLoading || getCurrenciesIsError;

  return (
    <section>
      <form className="text-white  w-full  border-light-gray h-full lg:py-5 py-3 lg:px-7 px-5 lg:pb-12 pb-4 bg-new-dark-grey rounded-[15px]">
        <div className="flex md:flex-row  flex-col lg:gap-2 gap-4 pb-4 md:items-center justify-between lg:pb-6 ">
          <p
            className={cn(
              "uppercase font-medium hidden md:block  lg:text-base mobile:text-sm text-xs md:font-bold",
              isCollapsed && "hidden",
            )}
          >
            Выберите направление обмена
          </p>
          <div className="flex flex-col mobile-xs:flex-row justify-center md:justify-between mobile-xs:gap-0 items-start mobile-xs:items-center">
            <div className="grid grid-cols-2 gap-2 items-center w-full   md:gap-2">
              <Link
                href={"/"}
                type="button"
                role="tab"
                id="changeOnline"
                className={cn(
                  " p-0  text-base   text-center  h-full   px-7 py-4 bg-new-light-grey text-white font-semibold rounded-[10px]",
                  urlDirection === ExchangerMarker.no_cash && " bg-yellow-main text-black",
                )}
              >
                Безналичные
              </Link>

              <Link
                href={`/?direction=cash`}
                type="button"
                role="tab"
                id="changeCash"
                className={cn(
                  " p-0  text-base  text-center  h-full  px-7 py-4 bg-new-light-grey text-white font-semibold rounded-[10px]",
                  urlDirection === ExchangerMarker.cash && " bg-yellow-main text-black",
                )}
              >
                Наличные
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {urlDirection === ExchangerMarker.cash && <LocationSelect countries={countries || []} />}
        </div>
        {!isDesktop ? (
          <div
            className={cn(
              "flex items-center  bg-new-grey py-4 px-8 rounded-xl gap-4",
              !isCollapsed && "flex-col",
            )}
          >
            <CurrencySelectMobile
              isCollapsed={isCollapsed}
              actualCourse={1}
              onClick={onClickGiveCurrency}
              disabled={
                giveCurrenciesIsLoading ||
                giveCurrenciesIsError ||
                (urlDirection === ExchangerMarker.cash && !urlLocation)
              }
              currencyInfo={urlGiveCurrency}
              currencies={giveCurrencies}
              direction={urlDirection}
              label="отдаю"
            />
            {!isCollapsed && <CurrencySwitcher direction={urlDirection} />}
            <CurrencySelectMobile
              isCollapsed={isCollapsed}
              actualCourse={actualCourse}
              onClick={onClickGetCurrency}
              currencyInfo={urlGetCurrency}
              disabled={isGetCurrencyDisabled}
              currencies={getCurrencies}
              label="получаю"
              direction={urlDirection}
            />
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 items-center justify-between lg:grid-cols-[1fr,auto,1fr]  lg:items-center lg:justify-center w-full gap-4",
            )}
          >
            <CurrencySelect
              actualCourse={1}
              onClick={onClickGiveCurrency}
              disabled={
                giveCurrenciesIsLoading ||
                giveCurrenciesIsError ||
                (urlDirection === ExchangerMarker.cash && !urlLocation)
              }
              currencyInfo={urlGiveCurrency}
              currencies={giveCurrencies}
              direction={urlDirection}
              label="отдаю"
            />

            <CurrencySwitcher direction={urlDirection} />

            <CurrencySelect
              actualCourse={actualCourse}
              onClick={onClickGetCurrency}
              currencyInfo={urlGetCurrency}
              disabled={isGetCurrencyDisabled}
              currencies={getCurrencies}
              label="получаю"
              direction={urlDirection}
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
