"use client";

import Image from "next/image";
import { CurrencyPair as CurrenyPairType } from "@/entities/currency";
import { DirectionLink } from "@/entities/direction";
import { ExchangeArrowIcon } from "@/shared/assets";
import { SegmentMarker } from "@/shared/types";

type CurrencyPairProps = {
  currencyPair: Omit<CurrenyPairType, "pairCount">;
};
export const CurrencyPair = (props: CurrencyPairProps) => {
  const { currencyPair } = props;

  return (
    <DirectionLink
      href={`/exchange/${currencyPair.valuteFrom.code_name}-to-${currencyPair.valuteTo.code_name}${currencyPair.direction_type === SegmentMarker.cash ? `?direction=${currencyPair.direction_type}` : ''}`}
      valuteFrom={currencyPair.valuteFrom.code_name}
      valuteTo={currencyPair.valuteTo.code_name}
      city={null}
      className="lg:px-3 lg:py-2 mobile-xl:px-2.5 px-4 py-2 grid mobile-xl:min-w-24 gap-2 grid-flow-col mobile-xl:min-h-12 grid-rows-1 justify-between items-center bg-new-grey hover:scale-[1.025] hover:bg-new-light-grey transition-all duration-300 mobile-xl:rounded-[12px] rounded-[7.5px]"
    >
      <Image
        className="rounded-full mobile-xl:size-[45px] size-[30px]"
        width={45}
        height={45}
        src={currencyPair.valuteFrom.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name}`}
      />
      <div className="[&>svg]:w-4">
        <ExchangeArrowIcon />
      </div>
      <Image
        className="rounded-full mobile-xl:size-[45px] size-[30px]"
        width={45}
        height={45}
        src={currencyPair.valuteTo.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name}`}
      />
    </DirectionLink>
  );
};
