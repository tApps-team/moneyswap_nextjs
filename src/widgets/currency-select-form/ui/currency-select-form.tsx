"use client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CurrencySwitcher, CurrencySelect } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, useCurrecnyStore, useGetAvailableValutes } from "@/entities/currency";
import { useDirectionStore } from "@/entities/direction";
import { Location, useGetCountries, useLocationStore } from "@/entities/location";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: Location;
  urlGetCurrency?: Currency;
  urlGiveCurrency?: Currency;
  urlDirection?: directions;
};
export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
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

    getCashCurrencyAmount,
    getCurrencyAmount,
    giveCashCurrencyAmount,
    giveCurrencyAmount,

    setGetCashCurrencyAmount,
    setGetCurrencyAmount,
    setGiveCashCurrencyAmount,
    setGiveCurrencyAmount,
  } = useCurrecnyStore((state) => state);

  const { direction, setDirection } = useDirectionStore((state) => state);

  const currentGiveCurrency = direction === directions.cash ? giveCashCurrency : giveCurrency;
  const currentGetCurrency = direction === directions.cash ? getCashCurrency : getCurrency;

  const currentSetGiveCurrency =
    direction === directions.cash ? setCashGiveCurrency : setGiveCurrency;
  const currentSetGetCurrency = direction === directions.cash ? setCashGetCurrency : setGetCurrency;

  const currentSetGiveAmount =
    direction === directions.cash ? setGiveCashCurrencyAmount : setGiveCurrencyAmount;
  const currentSetGetAmount =
    direction === directions.cash ? setGetCashCurrencyAmount : setGetCurrencyAmount;

  const currentGiveAmount =
    direction === directions.cash ? giveCashCurrencyAmount : giveCurrencyAmount;
  const currentGetAmount =
    direction === directions.cash ? getCashCurrencyAmount : getCurrencyAmount;

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
    if (isSetCurrencies && urlLocation && urlDirection === directions.cash) {
      setLocation(urlLocation);
      setCashGiveCurrency(urlGiveCurrency);
      setCashGetCurrency(urlGetCurrency);
      console.log(urlGiveCurrency, urlGetCurrency);
    }
    if (isSetCurrencies && urlDirection === directions.noncash) {
      setGiveCurrency(urlGiveCurrency);
      setGetCurrency(urlGetCurrency);
      console.log(urlGiveCurrency, urlGetCurrency);
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
  // useEffect(() => {
  //   const valuteNotEmpty = currentGiveCurrency && currentGetCurrency;
  //   if (valuteNotEmpty && direction === directions.noncash) {
  //     router.push(`/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}`);
  //   }
  //   if (valuteNotEmpty && direction === directions.cash) {
  //     router.push(
  //       `/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}/${location?.cityCodeName}`,
  //     );
  //   }
  // }, [currentGetCurrency, currentGiveCurrency, direction, location?.cityCodeName, router]);

  const onClickGetCurrency = (currency: Currency) => {
    currentSetGetCurrency(currency);

    const valuteNotEmpty = currentGiveCurrency && currency;

    if (valuteNotEmpty && direction === directions.noncash) {
      router.push(`/exchange/${currentGiveCurrency.code_name}-to-${currency.code_name}`);
    }
    if (valuteNotEmpty && direction === directions.cash) {
      router.push(
        `/exchange/${currentGiveCurrency.code_name}-to-${currency.code_name}/${location?.cityCodeName}`,
      );
    }
  };
  const onHandleTab = (currentDirection: directions) => {
    const cashValuteNotEmpty = giveCashCurrency && getCashCurrency;
    const valuteNotEmpty = giveCurrency && getCurrency;
    setDirection(currentDirection);
    if (currentDirection === directions.cash && cashValuteNotEmpty) {
      router.push(
        `/exchange/${giveCashCurrency.code_name}-to-${getCashCurrency.code_name}/${location?.cityCodeName}`,
      );
    }
    if (currentDirection === directions.noncash && valuteNotEmpty) {
      router.push(`/exchange/${giveCurrency.code_name}-to-${getCurrency.code_name}`);
    }
  };
  // const handleCashTab = () => {
  //   const valuteNotEmpty = giveCashCurrency && getCashCurrency;

  //   if (valuteNotEmpty) {
  //     router.push(
  //       `/exchange/${giveCashCurrency.code_name}-to-${getCashCurrency.code_name}/${location?.cityCodeName}`,
  //     );
  //   }
  // };
  // const handleTab = () => {
  //   const valuteNotEmpty = giveCurrency && getCurrency;

  //   if (valuteNotEmpty && direction) {
  //     router.push(`/exchange/${giveCurrency.code_name}-to-${getCurrency.code_name}`);
  //   }
  // };
  return (
    // <Form {...form}>
    <form className="text-white w-full border-2 border-[#bbbbbb] h-full py-5 px-7 pb-12 bg-[#2d2d2d] rounded-3xl">
      <div className=" flex items-center justify-between pb-6">
        <p className="uppercase font-medium text-base">Выберите направление обмена</p>
        <div className="flex items-center">
          {/* <Link href={routes.home}> */}
          <Button
            type="button"
            role="tab"
            id="changeCash"
            className={cn(
              "bg-transparent p-0 rounded-[4px] uppercase font-medium h-full",
              direction === directions.cash && "text-[#f6ff5f]",
            )}
            onClick={() => {
              onHandleTab(directions.cash);
            }}
          >
            Наличные
          </Button>
          {/* </Link> */}
          <div className="mx-2">\</div>
          {/* <Link href={routes.home}> */}
          <Button
            type="button"
            role="tab"
            id="changeOnline"
            className={cn(
              "bg-transparent p-0 rounded-[4px] uppercase font-medium h-full",
              direction === directions.noncash && "text-[#f6ff5f]",
            )}
            onClick={() => {
              onHandleTab(directions.noncash);
            }}
          >
            Безналичные
          </Button>
          {/* </Link> */}
        </div>
      </div>

      <div
        className={cx(
          "grid grid-cols-[1fr,auto,1fr] grid-rows-1 items-end justify-between gap-4",
          direction === directions.cash && "grid-flow-col",
        )}
      >
        <CurrencySelect
          setAmount={currentSetGiveAmount}
          amount={currentGiveAmount}
          onClick={currentSetGiveCurrency}
          disabled={(direction === directions.cash && !location) || !giveCurrencies}
          currencyInfo={currentGiveCurrency}
          currencies={giveCurrencies}
          direction={direction}
          label="отдаю"
        />

        <CurrencySwitcher direction={direction} />

        <CurrencySelect
          amount={currentGetAmount}
          setAmount={currentSetGetAmount}
          onClick={onClickGetCurrency}
          currencyInfo={currentGetCurrency}
          disabled={
            (!currentGetCurrency && !currentGiveCurrency) || (!currentGetCurrency && !getCurrencies)
          }
          currencies={getCurrencies}
          label="получаю"
          direction={direction}
        />

        {direction === directions.cash && <LocationSelect countries={countries || []} />}
      </div>
    </form>
    // </Form>
  );
};
