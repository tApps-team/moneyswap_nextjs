import Image from "next/image";
import Link from "next/link";
import { CurrencyPair as CurrenyPairType } from "@/entities/currency";
import { ExchangeArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

type CurrencyPairProps = {
  currencyPair: Omit<CurrenyPairType, "pairCount">;
};
export const CurrencyPair = (props: CurrencyPairProps) => {
  const { currencyPair } = props;
  const createUrl = () => {
    if (currencyPair.direction_type === ExchangerMarker.cash)
      return `${routes.home}exchange/${currencyPair.valuteFrom.code_name}-to-${currencyPair.valuteTo.code_name}?direction=${currencyPair.direction_type}`;
    return `${routes.home}exchange/${currencyPair.valuteFrom.code_name}-to-${currencyPair.valuteTo.code_name}`;
  };
  return (
    <Link
      href={createUrl()}
      className="lg:px-3 lg:py-2 px-2.5 py-2 grid mobile-xl:min-w-24 gap-2 grid-flow-col mobile-xl:min-h-12 grid-rows-1 justify-between items-center bg-new-grey hover:scale-[1.025] hover:bg-new-light-grey transition-all duration-300 mobile-xl:rounded-[12px] rounded-[7.5px]"
    >
      <Image
        className="rounded-full min-h-[1.65rem] min-w-[1.65rem]"
        width={45}
        height={45}
        src={currencyPair.valuteFrom.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name.ru}`}
      />
      <div className="[&>svg]:w-4">
        <ExchangeArrowIcon />
      </div>
      <Image
        className="rounded-full min-h-[1.65rem] min-w-[1.65rem]"
        width={45}
        height={45}
        src={currencyPair.valuteTo.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name.ru}`}
      />
    </Link>
  );
};
