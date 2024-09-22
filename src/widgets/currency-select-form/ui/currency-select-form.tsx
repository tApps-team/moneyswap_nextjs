"use client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  actualCourse: number | null;
};
export const CurrencySelectForm = (props: CurrencySelectFormProps) => {
  const { url, urlLocation, urlGetCurrency, urlGiveCurrency, urlDirection, actualCourse } = props;

  const router = useRouter();
  const pathname = usePathname();

  const onClickGetCurrency = (getCurrency: Currency) => {
    if (urlDirection === directions.cash) {
      router.push(
        `/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}/${urlLocation?.cityCodeName}`,
      );
    } else {
      router.push(`/exchange/${urlGiveCurrency?.code_name}-to-${getCurrency.code_name}`);
    }
  };
  const onClickGiveCurrency = (giveCurrency: Currency) => {
    if (urlDirection === directions.cash) {
      router.push(
        `/exchange/${giveCurrency?.code_name}-to-${urlGetCurrency?.code_name}/${urlLocation?.cityCodeName}`,
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
    city: urlDirection === directions.cash ? urlLocation?.cityCodeName : undefined,
  });

  const {
    data: getCurrencies,
    isLoading: getCurrenciesIsLoading,
    isError: getCurrenciesIsError,
  } = useGetAvailableValutes({
    base: urlGiveCurrency?.code_name,
    city: urlDirection === directions.cash ? urlLocation?.cityCodeName : undefined,
  });
  //TODO fix handleTab
  const onHandleTab = (currentDirection: directions) => {
    const cashValuteNotEmpty = urlLocation?.cityCodeName && urlGiveCurrency && urlGetCurrency;
    const valuteNotEmpty = urlGiveCurrency && urlGetCurrency;

    if (currentDirection === directions.cash && !cashValuteNotEmpty) {
      router.push(`${routes.home}?direction=cash`);
    }

    if (currentDirection === directions.cash && cashValuteNotEmpty) {
      router.push(
        `/exchange/${urlGiveCurrency.code_name}-to-${urlGetCurrency.code_name}/${urlLocation?.cityCodeName}`,
      );
    }
    if (currentDirection === directions.noncash && valuteNotEmpty) {
      router.push(`/exchange/${urlGiveCurrency.code_name}-to-${urlGetCurrency.code_name}`);
    }
    if (currentDirection === directions.noncash && !valuteNotEmpty) {
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
              urlDirection === directions.cash && "text-[#f6ff5f]",
            )}
            onClick={() => {
              onHandleTab(directions.cash);
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
              urlDirection === directions.noncash && "text-[#f6ff5f]",
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
          urlDirection === directions.cash && "grid-flow-col",
        )}
      >
        <CurrencySelect
          actualCourse={1}
          onClick={onClickGiveCurrency}
          disabled={(urlDirection === directions.cash && !urlLocation) || !giveCurrencies}
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
          disabled={(!urlGetCurrency && !urlGiveCurrency) || (!urlGiveCurrency && !getCurrencies)}
          currencies={getCurrencies}
          label="получаю"
          direction={urlDirection}
        />

        {urlDirection === directions.cash && <LocationSelect countries={countries || []} />}
      </div>
    </form>
    // </Form>
  );
};
