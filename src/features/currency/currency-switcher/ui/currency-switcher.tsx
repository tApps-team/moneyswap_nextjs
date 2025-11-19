"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { increaseDirectionCount } from "@/entities/direction";
import { SwapIcon } from "@/shared/assets";
import { useSmartPrefetch } from "@/shared/hooks";
import { IsEmptyObject } from "@/shared/lib";
import { SegmentMarker } from "@/shared/types";

type CurrencySwitcherProps = {
  direction?: Exclude<SegmentMarker, SegmentMarker.both>;
};
const defaultCashValutes = {
  valuteFrom: "CASHRUB",
  valuteTo: "BTC",
};
const defaultNoCashValutes = {
  valuteFrom: "SBERRUB",
  valuteTo: "BTC",
};
export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { direction } = props;
  const searchParams = useSearchParams();
  const params = useParams<{
    slug: string[];
  }>();
  const city = searchParams.get("city") || "msk";
  const emptyParams = IsEmptyObject({ obj: params });

  const switchUrl = () => {

    if (emptyParams) {
      if (direction === SegmentMarker.cash) {
        return `/exchange/${defaultCashValutes.valuteTo}-to-${defaultCashValutes.valuteFrom}?city=${city}`;
      }
      if (direction === SegmentMarker.no_cash) {
        return `/exchange/${defaultNoCashValutes.valuteTo}-to-${defaultNoCashValutes.valuteFrom}`;
      }
    }
    if (!emptyParams) {
      const [valuteFrom, valuteTo] = params?.slug[0]?.split("-to-");
      if (direction === SegmentMarker.cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}?city=${city}`;
      }
      if (direction === SegmentMarker.no_cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}`;
      }
    }

    return "/";
  };

  const { prefetch, cancelPrefetch } = useSmartPrefetch({ delay: 150, cancelPrevious: true });
  const handlePrefetch = useCallback(() => {
    prefetch(switchUrl());
  }, [prefetch, params]);

  const handleMouseEnter = handlePrefetch;
  const handleTouchStart = handlePrefetch;
  const handleMouseLeave = cancelPrefetch;
  const handleTouchEnd = cancelPrefetch;

  const cityCodeName = searchParams.get("city") ?? null;

  const handleIncreaseDirectionCount = () => {
    if (!emptyParams) {
      const [valuteFrom, valuteTo] = params?.slug[0]?.split("-to-");
      const increaseDirectionCountReq = {
        valute_from: valuteTo,
        valute_to: valuteFrom,
        city_code_name: cityCodeName,
      };
      increaseDirectionCount(increaseDirectionCountReq);
    } else {
      const increaseDirectionCountReq = {
        valute_from: direction === SegmentMarker.cash ? defaultCashValutes.valuteTo : defaultNoCashValutes.valuteTo,
        valute_to: direction === SegmentMarker.cash ? defaultCashValutes.valuteFrom : defaultNoCashValutes.valuteFrom,
        city_code_name: cityCodeName,
      };
      increaseDirectionCount(increaseDirectionCountReq);
    }
  }

  return (
    <Link
      href={switchUrl()}
      className="relative w-full mx-auto flex justify-center items-center mobile:-mb-4 -mb-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleIncreaseDirectionCount}
    >
      <div className="z-10 bg-new-light-grey md:w-[54px] md:h-[54px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
        <SwapIcon className="md:size-7 size-5" />
      </div>
      <div className="md:hidden block -z-0 w-full h-[3px] rounded-[5px] bg-new-light-grey absolute top-[50%] -translate-y-[50%]"></div>
    </Link>
  );
};
