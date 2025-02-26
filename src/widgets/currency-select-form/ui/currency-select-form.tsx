"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
      <form
        className={cn(
          "grid grid-flow-row text-white w-full border-light-gray h-full lg:pb-10 lg:py-6 lg:px-7 md:p-8 md:py-3 md:px-5 md:pb-4 p-4 mobile-xl:pb-[30px] pb-5 bg-new-dark-grey rounded-[15px]",
          isCollapsed ? "gap-3" : "md:gap-5 gap-6",
        )}
      >
        <div className="flex md:flex-row flex-col lg:gap-2 gap-4 md:items-center justify-between">
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
                  " p-0 mobile-xl:text-base text-sm text-center h-full mobile-xl:px-7 px-2 py-4 bg-new-light-grey text-white font-semibold rounded-[10px]",
                  urlDirection === ExchangerMarker.cash && " bg-yellow-main text-black",
                )}
              >
                Наличные
              </Link>
            </div>
          </div>
        </div>
        {urlDirection === ExchangerMarker.cash && <LocationSelect countries={countries || []} />}
        {!isDesktop ? (
          <div
            className={cn(
              "",
              !isCollapsed
                ? "flex-col flex items-center gap-4"
                : "grid grid-cols-2 bg-new-grey py-3 px-4 rounded-[10px] gap-2",
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
