"use client";
import { cx } from "class-variance-authority";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CurrecnySwitcher, CurrencySelect } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { useCurrecnyStore, useGetAvailableValutes } from "@/entities/currency";
import { useDirectionStore } from "@/entities/direction";
import { useGetCountries, useLocationStore } from "@/entities/location";
import { cn } from "@/shared/lib";
import { directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrecnySelectFormProps = {
  url?: string;
};
export const CurrecnySelectForm = (props: CurrecnySelectFormProps) => {
  const { url } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const location = useLocationStore((state) => state.location);
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

  useEffect(() => {
    if (getCurrenciesIsError) {
      direction === directions.cash ? resetCashCurrencies() : resetNoCashCurrencies();
    }
  }, [getCurrenciesIsError, resetCashCurrencies, resetNoCashCurrencies, direction]);
  useEffect(() => {
    const valuteNotEmpty = currentGiveCurrency && currentGetCurrency;
    if (valuteNotEmpty && direction !== directions.cash) {
      router.push(`/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}`);
    }
    if (valuteNotEmpty && direction === directions.cash) {
      router.push(
        `/exchange/${currentGiveCurrency.code_name}-to-${currentGetCurrency.code_name}/${location?.cityCodeName}`,
      );
    }
  }, [currentGetCurrency, currentGiveCurrency, location?.cityCodeName, router, direction]);

  return (
    // <Form {...form}>
    <form className="text-white h-72 py-4 px-7 bg-[#16192e] rounded-lg">
      <div className=" flex items-center justify-between">
        <p>Выберите направление обмена</p>
        <div className="flex gap-4 bg-[#2d3049] rounded-[4px] p-1">
          <Button
            type="button"
            role="tab"
            id="changeCash"
            className={cn(
              "bg-transparent rounded-[4px] py-2 px-6 hover:brightness-125 ",
              direction === directions.cash && "bg-[#16192e]",
            )}
            onClick={() => setDirection(directions.cash)}
          >
            Обмен наличных
          </Button>
          <Button
            type="button"
            role="tab"
            id="changeOnline"
            className={cn(
              "bg-transparent rounded-[4px] py-2 px-6 hover:brightness-125",
              direction === directions.noncash && "bg-[#16192e]",
            )}
            onClick={() => setDirection(directions.noncash)}
          >
            Обмен онлайн
          </Button>
        </div>
      </div>
      <div>
        <div className={cx("flex items-center justify-between")}>
          <CurrencySelect
            onClick={currentSetGiveCurrency}
            disabled={(direction === directions.cash && !location) || !giveCurrencies}
            currencyInfo={currentGiveCurrency}
            currencies={giveCurrencies}
            label="Отдаете"
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
            label="Получаете"
          />

          {direction === directions.cash && <LocationSelect countries={countries || []} />}
        </div>
      </div>
    </form>
    // </Form>
  );
};
