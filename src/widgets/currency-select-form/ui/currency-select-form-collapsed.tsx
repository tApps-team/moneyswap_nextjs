"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CurrencySelectMobile } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, SpecificValute, useGetAvailableValutes } from "@/entities/currency";
import { LocationInfo, useGetCountries } from "@/entities/location";
import { cn } from "@/shared/lib";
import { ExchangerMarker } from "@/shared/types";

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: LocationInfo;
  urlGetCurrency?: SpecificValute;
  urlGiveCurrency?: SpecificValute;
  urlDirection: ExchangerMarker;
  actualCourse: number | null;
};

export const CurrencySelectFormCollapsed = (props: CurrencySelectFormProps) => {
  const { urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse } = props;
  const router = useRouter();

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
      <form className="text-white flex flex-col gap-4 w-full border-2 border-light-gray h-full lg:py-5 py-3 lg:px-7 px-5 lg:pb-12 pb-4 bg-dark-gray rounded-3xl">
        <div className="flex lg:flex-row  flex-col lg:gap-2 gap-4  lg:items-center justify-between  ">
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
        <hr />
        <div className={cn("grid grid-cols-2 gap-6")}>
          <CurrencySelectMobile
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

          <CurrencySelectMobile
            actualCourse={actualCourse}
            onClick={onClickGetCurrency}
            currencyInfo={urlGetCurrency}
            disabled={isGetCurrencyDisabled}
            currencies={getCurrencies}
            label="получаю"
            direction={urlDirection}
          />
          <div className="lg:block hidden">
            {urlDirection === ExchangerMarker.cash && (
              <LocationSelect countries={countries || []} />
            )}
          </div>
        </div>
      </form>
      <div className="border flex items-center justify-center rounded-full mx-auto bg-dark-gray -translate-y-4 w-1/4">
        <ChevronDown />
      </div>
    </section>
  );
};
