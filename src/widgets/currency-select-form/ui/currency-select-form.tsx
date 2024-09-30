"use client";
import { cx } from "class-variance-authority";
import { usePathname, useRouter } from "next/navigation";
import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import { LocationSelect } from "@/features/location";
import { Currency, useGetAvailableValutes } from "@/entities/currency";
import { LocationInfo, useGetCountries } from "@/entities/location";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { ExchangerMarker, directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySelectFormProps = {
  url?: string;
  urlLocation?: LocationInfo;
  urlGetCurrency?: Currency;
  urlGiveCurrency?: Currency;
  urlDirection?: ExchangerMarker;
  actualCourse: number | null;
};
export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
  const { url, urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse } = props;

  const router = useRouter();
  const pathname = usePathname();

  const onClickGetCurrency = (getCurrency: Currency) => {
    if (urlDirection === ExchangerMarker.cash) {
      router.push(
        `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}?city=${urlLocation?.code_name}`,
      );
    } else {
      router.push(`/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}`);
    }
  };
  const onClickGiveCurrency = (giveCurrency: Currency) => {
    if (urlDirection === ExchangerMarker.cash) {
      router.push(
        `/exchange/${giveCurrency?.code_name}-to-${urlGetCurrency?.code_name}?city=${urlLocation?.code_name}`,
      );
    } else {
      router.push(`/exchange/${giveCurrency?.code_name}-to-${urlGetCurrency?.code_name}`);
    }
  };

  const { data: countries } = useGetCountries();

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
  } = useGetAvailableValutes({
    base: urlGiveCurrency?.code_name,
    city: urlDirection === ExchangerMarker.cash ? urlLocation?.code_name : undefined,
  });
  //TODO fix handleTab
  const onHandleTab = (currentDirection: ExchangerMarker) => {
    if (currentDirection === ExchangerMarker.cash) {
      router.push(`${routes.home}?direction=cash`);
    }

    if (currentDirection === ExchangerMarker.no_cash) {
      router.push(`${routes.home}`);
    }
  };

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
              urlDirection === ExchangerMarker.cash && "text-[#f6ff5f]",
            )}
            onClick={() => {
              onHandleTab(ExchangerMarker.cash);
            }}
          >
            Наличные
          </Button>
          {/* </Link> */}
          <div className="mx-2">\</div>
          {/* <Link href={`${}`}> */}
          <Button
            type="button"
            role="tab"
            id="changeOnline"
            className={cn(
              "bg-transparent p-0 rounded-[4px] uppercase font-medium h-full",
              urlDirection === ExchangerMarker.no_cash && "text-[#f6ff5f]",
            )}
            onClick={() => {
              onHandleTab(ExchangerMarker.no_cash);
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
          urlDirection === ExchangerMarker.cash && "grid-flow-col",
        )}
      >
        <CurrencySelect
          actualCourse={1}
          onClick={onClickGiveCurrency}
          disabled={(urlDirection === ExchangerMarker.cash && !urlLocation) || !giveCurrencies}
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
          disabled={!urlLocation}
          currencies={getCurrencies}
          label="получаю"
          direction={urlDirection}
        />

        {urlDirection === ExchangerMarker.cash && <LocationSelect countries={countries || []} />}
      </div>
    </form>
    // </Form>
  );
};
