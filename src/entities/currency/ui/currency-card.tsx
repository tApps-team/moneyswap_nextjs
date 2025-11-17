"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { useSmartPrefetch, useYandexMetrika } from "@/shared/hooks";
// eslint-disable-next-line
import { increaseDirectionCount } from "@/entities/direction";
import { cn } from "@/shared/lib";
import { SegmentMarker } from "@/shared/types";
import { Currency } from "../model/types/currencyType";

type CurrencyCardProps = {
  currency: Currency;
  currencyInfo?: Currency | null;
  type: "give" | "get";
  direction?: Exclude<SegmentMarker, SegmentMarker.both>;
  location_code_name?: string;
  index?: number;
  onClose?: () => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, currencyInfo, type, direction, location_code_name, index, onClose } = props;
  const { prefetch } = useSmartPrefetch({ delay: 150, cancelPrevious: true });

  const { cashGive, cashReceive, cashlessGive, cashlessReceive } = useYandexMetrika();
  
  const giveRoute =
  direction === SegmentMarker.cash
  ? `/exchange/${currency?.code_name}-to-${currencyInfo?.code_name}?city=${location_code_name}`
  : `/exchange/${currency?.code_name}-to-${currencyInfo?.code_name}`;
  
  const getRoute =
  direction === SegmentMarker.cash
  ? `/exchange/${currencyInfo?.code_name}-to-${currency?.code_name}?city=${location_code_name}`
  : `/exchange/${currencyInfo?.code_name}-to-${currency?.code_name}`;

  const handlePrefetch = useCallback(() => {
    const route = type === "give" ? giveRoute : getRoute;
    prefetch(route);
  }, [prefetch, type, giveRoute, getRoute]);
  const handleMouseEnter = handlePrefetch;
  const handleTouchStart = handlePrefetch;

  // Увеличиваем счетчик популярности направления
  const handleIncreaseDirectionCount = () => {
    if (currency?.code_name && currencyInfo?.code_name) {
      const increaseDirectionCountReq = {
        valute_from: type === "give" ? currency?.code_name : currencyInfo?.code_name,
        valute_to: type === "give" ? currencyInfo?.code_name : currency?.code_name,
        city_code_name: location_code_name ?? null,
      };
      increaseDirectionCount(increaseDirectionCountReq);
    }
  }

  return (
    <Link
      href={type === "give" ? giveRoute : getRoute}
      className={`${index === 0 ? "py-2 pt-5" : "py-2"} relative bg-transparent h-full w-full grid grid-flow-col justify-start justify-items-start gap-5 md:px-3 px-1 text-white rounded-[7px] hover:bg-new-grey`}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onClick={() => {
        // Закрываем модалку мгновенно
        onClose?.();
        
        if (type === "give") {
          direction === SegmentMarker.no_cash ? cashlessGive() : cashGive();
        } else {
          direction === SegmentMarker.no_cash ? cashlessReceive() : cashReceive();
        }
        handleIncreaseDirectionCount();
      }}
    >
      {currency?.is_popular && (
        <span
          className={cn(
            "absolute md:right-4 right-3 text-[10px] rounded-[3px] bg-yellow-main text-black text-center py-[2px] px-2 font-medium",
            index === 0 ? "translate-y-1" : "-translate-y-2",
          )}
        >
          Популярное
        </span>
      )}
      <figure className="mobile-xl:w-[42px] mobile-xl:h-[42px] size-9 rounded-full overflow-hidden">
        <Image
          src={currency.icon_url}
          width={42}
          height={42}
          alt={`${currency?.name} (${currency?.code_name})`}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="h-full grid grid-flow-row justify-start justify-items-start items-stretch content-between mobile-xl:text-base text-sm">
        <p className="font-bold uppercase line-clamp-1 leading-none">{currency?.name?.ru}</p>
        <span className="font-medium text-font-dark-grey leading-none">{currency?.code_name}</span>
      </div>
    </Link>
  );
};
