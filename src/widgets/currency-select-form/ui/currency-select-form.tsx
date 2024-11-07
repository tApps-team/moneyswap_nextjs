"use client";

import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  console.log(getCurrenciesIsError);
  const isGetCurrencyDisabled = getCurrenciesIsLoading || getCurrenciesIsError;

  return (
    <form className="text-white  w-full border-2 border-light-gray h-full py-5 px-7 pb-12 bg-dark-gray rounded-3xl">
      <div className="mobile-xl:flex mobile-xl:flex-row flex flex-col gap-2 mobile-xl:items-center justify-between pb-6">
        <p className="uppercase font-medium mobile-xl:text-base text-xs">
          Выберите направление обмена
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href={`/?direction=cash`}
              type="button"
              role="tab"
              id="changeCash"
              className={cn(
                "bg-transparent p-0 rounded-[4px] mobile-xl:text-base text-2xs uppercase font-medium h-full",
                urlDirection === ExchangerMarker.cash && "text-yellow-main",
              )}
            >
              Наличные
            </Link>
            <div className="mobile-xl:mx-2 mx-1">/</div>
            <Link
              href={"/"}
              type="button"
              role="tab"
              id="changeOnline"
              className={cn(
                "bg-transparent p-0 rounded-[4px] mobile-xl:text-base text-2xs uppercase font-medium h-full",
                urlDirection === ExchangerMarker.no_cash && "text-yellow-main",
              )}
            >
              Безналичные
            </Link>
          </div>
          <div className="mobile-xl:hidden block">
            {urlDirection === ExchangerMarker.cash && (
              <LocationSelect countries={countries || []} />
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "grid mobile-xl:grid-cols-[1fr,auto,1fr] mobile-xl:items-end w-full gap-4",
          "grid-cols-1 items-center justify-between",
          urlDirection === ExchangerMarker.cash && "mobile-xl:grid-flow-col",
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
        <div className="mobile-xl:block hidden">
          {urlDirection === ExchangerMarker.cash && <LocationSelect countries={countries || []} />}
        </div>
      </div>
    </form>
  );
};
