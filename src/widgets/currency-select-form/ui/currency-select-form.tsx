"use client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CurrecnySwitcher, CurrencySelect } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, useCurrecnyStore, useGetAvailableValutes } from "@/entities/currency";
import { useDirectionStore } from "@/entities/direction";
import { Location, useGetCountries, useLocationStore } from "@/entities/location";
import { cn } from "@/shared/lib";
import { directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrecnySelectFormProps = {
  url?: string;
  urlLocation?: Location;
  urlGetCurrency?: Currency;
  urlGiveCurrency?: Currency;
  urlDirection?: directions;
};
export const CurrecnySelectForm = (props: CurrecnySelectFormProps) => {
  const { url, urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection } = props;

  const router = useRouter();
  const { location, setLocation } = useLocationStore((state) => state);
  const {
    getCurrency,
    giveCurrency,
    getCashCurrency,
    giveCashCurrency,
    setCashGetCurrency,
    setCashGiveCurrency,
    setGetCurrency,
    setGiveCurrency,
    resetCashCurrencies,
    resetNoCashCurrencies,
  } = useCurrecnyStore((state) => state);

  const { direction, setDirection } = useDirectionStore((state) => state);

  const currentGiveCurrency = direction === directions.cash ? giveCashCurrency : giveCurrency;
  const currentGetCurrency = direction === directions.cash ? getCashCurrency : getCurrency;

  const currentSetGiveCurrency =
    direction === directions.cash ? setCashGiveCurrency : setGiveCurrency;
  const currentSetGetCurrency = direction === directions.cash ? setCashGetCurrency : setGetCurrency;
  useEffect(() => {
    if (urlDirection === directions.cash) {
      setDirection(directions.cash);
    }
    if (urlDirection === directions.noncash) {
      setDirection(directions.noncash);
    }
  }, [setDirection, urlDirection]);
  useEffect(() => {
    const isSetCurrencies = urlGiveCurrency && urlGetCurrency;
    console.log(urlLocation, "urlLocation");
    if (isSetCurrencies && urlLocation && urlDirection === directions.cash) {
      setLocation(urlLocation);
      setCashGiveCurrency(urlGiveCurrency);
      setCashGetCurrency(urlGetCurrency);
      console.log("isSetCurrencies && urlLocation");
    }
    if (isSetCurrencies && urlDirection === directions.noncash) {
      setGiveCurrency(urlGiveCurrency);
      setGetCurrency(urlGetCurrency);
      console.log("isSetCurrencies && !urlLocation");
    }
  }, [
    setCashGetCurrency,
    setCashGiveCurrency,
    setGetCurrency,
    setGiveCurrency,
    setLocation,
    urlDirection,
    urlGetCurrency,
    urlGiveCurrency,
    urlLocation,
  ]);
  const { data: countries } = useGetCountries();

  const {
    data: giveCurrencies,
    isLoading: giveCurrenciesIsLoading,
    isError: giveCurrenciesIsError,
  } = useGetAvailableValutes({
    base: "all",
    city: direction === directions.cash ? location?.cityCodeName : undefined,
  });

  const {
    data: getCurrencies,
    isLoading: getCurrenciesIsLoading,
    isError: getCurrenciesIsError,
  } = useGetAvailableValutes({
    base: currentGiveCurrency?.code_name,
    city: direction === directions.cash ? location?.cityCodeName : undefined,
  });

  // useEffect(() => {
  //   if (getCurrenciesIsError) {
  //     direction === directions.cash ? resetCashCurrencies() : resetNoCashCurrencies();
  //   }
  // }, [direction, getCurrenciesIsError, resetCashCurrencies, resetNoCashCurrencies]);
  useEffect(() => {
    const valuteNotEmpty = currentGiveCurrency && currentGetCurrency;
    if (valuteNotEmpty && direction === directions.noncash) {
      router.push(`/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}`);
    }
    if (valuteNotEmpty && direction === directions.cash) {
      router.push(
        `/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}/${location?.cityCodeName}`,
      );
    }
  }, [currentGetCurrency, currentGiveCurrency, direction, location?.cityCodeName, router]);

  // const onClickGetCurrency = (currency: Currency) => {
  //   currentSetGetCurrency(currency);
  //   const valuteNotEmpty = currentGiveCurrency && currentGetCurrency;

  //   if (valuteNotEmpty && direction !== directions.cash) {
  //     router.push(`/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}`);
  //   }
  //   if (valuteNotEmpty && direction === directions.cash) {
  //     router.push(
  //       `/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}/${location?.cityCodeName}`,
  //     );
  //   }
  // };

  return (
    // <Form {...form}>
    <form className="text-white w-full border border-[#bbbbbb] h-72 py-4 px-7 bg-[#2d2d2d] rounded-lg">
      <div className=" flex items-center justify-between">
        <p className="uppercase">Выберите направление обмена</p>
        <div className="flex items-center">
          <Link href={"/"}>
            <Button
              type="button"
              role="tab"
              id="changeCash"
              className={cn(
                "bg-transparent rounded-[4px] py-2 px-6  uppercase",
                direction === directions.cash && "text-[#f6ff5f]",
              )}
              onClick={() => setDirection(directions.cash)}
            >
              Наличные
            </Button>
          </Link>
          <div>\</div>
          <Link href={"/"}>
            <Button
              type="button"
              role="tab"
              id="changeOnline"
              className={cn(
                "bg-transparent rounded-[4px] py-2 px-6  uppercase",
                direction === directions.noncash && "text-[#f6ff5f]",
              )}
              onClick={() => {
                setDirection(directions.noncash);
              }}
            >
              Безналичные
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div
          className={cx(
            "grid grid-cols-[1fr,50px,1fr] grid-rows-1 items-end justify-between gap-4",
            direction === directions.cash && "grid-cols-[1fr,50px,1fr,200px]",
          )}
        >
          <CurrencySelect
            onClick={currentSetGiveCurrency}
            disabled={(direction === directions.cash && !location) || !giveCurrencies}
            currencyInfo={currentGiveCurrency}
            currencies={giveCurrencies}
            label="отдаю"
          />

          <CurrecnySwitcher />

          <CurrencySelect
            onClick={currentSetGetCurrency}
            currencyInfo={currentGetCurrency}
            disabled={
              (!currentGetCurrency && !currentGiveCurrency) ||
              (!currentGetCurrency && !getCurrencies)
            }
            currencies={getCurrencies}
            label="получаю"
          />

          {direction === directions.cash && <LocationSelect countries={countries || []} />}
        </div>
      </div>
    </form>
    // </Form>
  );
};
