import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/shared/lib";
import { Currency, CurrencyResponse } from "../model/types/currencyType";

type CurrencyFromCardProps = {
  currencyCurrent: Currency;
  currencyInfo?: Currency | null;
  type: "give" | "get";
  setCurrencyInfo: (currency: Currency | null) => void;
  selectedCurrency: Currency | null;
  currencies: CurrencyResponse[];
};

export const CurrencyFromCard = (props: CurrencyFromCardProps) => {
  const { currencyCurrent, currencyInfo, type, setCurrencyInfo, selectedCurrency, currencies } = props;

  const randomCurrency = useMemo(() => {
    const allCurrencies = currencies.flatMap((category) =>
      category.currencies.map((currency) => ({
        ...currency,
        categoryId: category.id,
        categoryName: {
          ru: category.name?.ru,
          en: category.name?.en,
        },
      }))
    );
    if (allCurrencies.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allCurrencies.length);
    return allCurrencies[randomIndex];
  }, [currencies]);

  const DEFAULT_BASE_CURRENCY = "usdttrc20";
  const baseCurrency = randomCurrency?.code_name || DEFAULT_BASE_CURRENCY;
  
  const giveRoute = `/exchange/${currencyCurrent?.code_name}-to-${currencyInfo?.code_name}`;
  const getRoute = `/exchange/${currencyInfo?.code_name}-to-${currencyCurrent?.code_name}`;
  const seoRoute = type === "give" 
    ? `/exchange/${currencyCurrent?.code_name}-to-${baseCurrency}`
    : `/exchange/${baseCurrency}-to-${currencyCurrent?.code_name}`;
  
  const content = (
      <div className={cn("w-full h-full grid mobile-xl:grid-flow-col grid-flow-row mobile-xl:gap-2 gap-0 justify-between justify-items-stretch items-center content-between md:text-base text-sm")}>
        <p className={cn("font-bold uppercase line-clamp-1 leading-none", selectedCurrency?.id === currencyCurrent?.id ? "text-black" : "text-white")}>{currencyCurrent?.name?.ru}</p>
        <span className={cn("font-medium leading-none mobile-xl:text-base text-xs", selectedCurrency?.id === currencyCurrent?.id ? "text-black" : "text-font-dark-grey")}>{currencyCurrent?.code_name}</span>
      </div>
  );

  if (currencyInfo) {
    return (
      <Link
        href={type === "give" ? giveRoute : getRoute}
        className={cn(
          "grid cursor-pointer py-2 bg-transparent h-full w-full md:px-3 px-2 text-white rounded-[7px] hover:scale-[0.975] duration-300 transition-all",
          selectedCurrency?.id === currencyCurrent?.id ? "bg-yellow-main" : "bg-transparent"
        )}
        onClick={() => {
            if (selectedCurrency?.id === currencyCurrent?.id) {
                setCurrencyInfo(null);
            } else {
                setCurrencyInfo(currencyCurrent);
            }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={seoRoute}
      className={cn(
        "grid cursor-pointer py-2 bg-transparent h-full w-full md:px-3 px-2 text-white rounded-[7px] hover:scale-[0.975] duration-300 transition-all",
        selectedCurrency?.id === currencyCurrent?.id ? "bg-yellow-main" : "bg-transparent"
      )}
      onClick={(e) => {
        e.preventDefault();
        if (selectedCurrency?.id === currencyCurrent?.id) {
          setCurrencyInfo(null);
        } else {
          setCurrencyInfo(currencyCurrent);
        }
      }}
    >
      {content}
    </Link>
  );
};
