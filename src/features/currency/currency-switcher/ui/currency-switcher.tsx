"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SwapIcon, SwitcherIcon } from "@/shared/assets";
import { IsEmptyObject } from "@/shared/lib";
import { ExchangerMarker } from "@/shared/types";

type CurrencySwitcherProps = {
  direction?: ExchangerMarker;
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
  const switchUrl = () => {
    const emptyParams = IsEmptyObject({ obj: params });

    if (emptyParams) {
      if (direction === ExchangerMarker.cash) {
        return `/exchange/${defaultCashValutes.valuteTo}-to-${defaultCashValutes.valuteFrom}?city=${city}`;
      }
      if (direction === ExchangerMarker.no_cash) {
        return `/exchange/${defaultNoCashValutes.valuteTo}-to-${defaultNoCashValutes.valuteFrom}`;
      }
    }
    if (!emptyParams) {
      const [valuteFrom, valuteTo] = params?.slug[0]?.split("-to-");
      if (direction === ExchangerMarker.cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}?city=${city}`;
      }
      if (direction === ExchangerMarker.no_cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}`;
      }
    }

    return "/";
  };

  return (
    <Link
      href={switchUrl()}
      className="relative w-full mx-auto flex justify-center items-center mobile:-mb-4 -mb-2"
    >
      <div className="z-10 bg-new-light-grey md:w-[54px] md:h-[54px] w-[40px] h-[40px] flex justify-center items-center rounded-full">
        <SwapIcon className="md:size-7 size-5" />
      </div>
      <div className="md:hidden block -z-0 w-full h-[3px] rounded-[5px] bg-new-light-grey absolute top-[50%] -translate-y-[50%]"></div>
    </Link>
  );
};
