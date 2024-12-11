"use client";

import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, useGetAvailableValutes } from "@/entities/currency";
import { LocationInfo, useGetCountries } from "@/entities/location";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: LocationInfo;
  urlGetCurrency?: Currency;
  urlGiveCurrency?: Currency;
  urlDirection: ExchangerMarker;
  actualCourse: number | null;
};

export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
  const { urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  // const onClickCurrency = (currency:Currency) => {
  //   switch(urlDirection){
  //     case ExchangerMarker.cash:
  //       const router =
  //   }
  // }
  const onClickGetCurrency = (getCurrency: Currency) => {
    const route =
      urlDirection === ExchangerMarker.cash
        ? `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}?city=${city}`
        : `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}`;

    router.push(route);
  };

  const onClickGiveCurrency = (giveCurrency: Currency) => {
    const route =
      urlDirection === ExchangerMarker.cash
        ? `/exchange/${giveCurrency.code_name}-to-${urlGetCurrency?.code_name}?city=${city}`
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
    <form className="text-white  w-full border-2 border-light-gray h-full lg:py-5 py-3 lg:px-7 px-5 lg:pb-12 pb-4 bg-dark-gray rounded-3xl">
      <div className="flex lg:flex-row  flex-col lg:gap-2 gap-4 pb-4 lg:items-center justify-between lg:pb-6 ">
        <p className="uppercase font-medium lg:text-base mobile:text-sm text-xs">
          Выберите направление обмена
        </p>
        <div className="flex flex-col mobile-xs:flex-row justify-between mobile-xs:gap-0 items-start mobile-xs:items-center">
          <div className="flex items-center">
            <Link
              href={`/?direction=cash`}
              type="button"
              role="tab"
              id="changeCash"
              className={cn(
                "bg-transparent p-0 rounded-[4px] md:text-base text-2xs uppercase font-medium h-full text-light-gray",
                urlDirection === ExchangerMarker.cash && "text-yellow-main",
              )}
            >
              Наличные
            </Link>
            <div className="lg:mx-2 mx-1">/</div>
            <Link
              href={"/"}
              type="button"
              role="tab"
              id="changeOnline"
              className={cn(
                "bg-transparent p-0 rounded-[4px] md:text-base text-2xs uppercase font-medium h-full text-light-gray",
                urlDirection === ExchangerMarker.no_cash && "text-yellow-main",
              )}
            >
              Безналичные
            </Link>
          </div>
          <div className="lg:hidden block">
            {urlDirection === ExchangerMarker.cash && (
              <LocationSelect countries={countries || []} />
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "grid lg:grid-cols-[1fr,auto,1fr] lg:items-end w-full gap-4",
          "grid-cols-1 items-center justify-between",
          urlDirection === ExchangerMarker.cash && "lg:grid-flow-col",
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
        <div className="lg:block hidden">
          {urlDirection === ExchangerMarker.cash && <LocationSelect countries={countries || []} />}
        </div>
      </div>
    </form>
  );
};
