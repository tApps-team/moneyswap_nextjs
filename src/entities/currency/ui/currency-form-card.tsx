import Link from "next/link";
import { useSmartPrefetch, useYandexMetrika } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Currency } from "../model/types/currencyType";

type CurrencyFromCardProps = {
  currencyCurrent: Currency;
  currencyInfo?: Currency | null;
  type: "give" | "get";
  setCurrencyInfo: (currency: Currency | null) => void;
  selectedCurrency: Currency | null;
};

export const CurrencyFromCard = (props: CurrencyFromCardProps) => {
  const { currencyCurrent, currencyInfo, type, setCurrencyInfo, selectedCurrency } = props;
  const { prefetch } = useSmartPrefetch({ delay: 150, cancelPrevious: true });
  const { cashGive, cashReceive, cashlessGive, cashlessReceive } = useYandexMetrika();

  const giveRoute = `/exchange/${currencyCurrent?.code_name}-to-${currencyInfo?.code_name}`;
  const getRoute = `/exchange/${currencyInfo?.code_name}-to-${currencyCurrent?.code_name}`;
  
  const content = (
      <div className={cn("w-full h-full grid grid-flow-col gap-2 justify-between justify-items-stretch items-center content-between md:text-base mobile-xl:text-sm text-xs")}>
        <p className={cn("font-bold uppercase line-clamp-1 leading-none", selectedCurrency?.id === currencyCurrent?.id ? "text-black" : "text-white")}>{currencyCurrent?.name?.ru}</p>
        <span className={cn("font-medium leading-none", selectedCurrency?.id === currencyCurrent?.id ? "text-black" : "text-font-dark-grey")}>{currencyCurrent?.code_name}</span>
      </div>
  );

  // ✅ Если currencyInfo есть — используем Link
  if (currencyInfo) {
    return (
      <Link
        href={type === "give" ? giveRoute : getRoute}
        className={cn(
          "grid cursor-pointer py-2 bg-transparent h-full w-full md:px-3 px-2 text-white rounded-[7px] hover:scale-[1.025] duration-300 transition-all",
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

  // 🚫 Если currencyInfo нет — просто div без перехода
  return (
    <div
      className={cn(
        "grid cursor-pointer py-2 bg-transparent h-full w-full md:px-3 px-2 text-white rounded-[7px] hover:scale-[1.025] duration-300 transition-all",
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
    </div>
  );
};
