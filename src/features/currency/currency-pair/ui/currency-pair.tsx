import Image from "next/image";
import Link from "next/link";
import { CurrencyPair as CurrenyPairType, SpecificValute } from "@/entities/currency";
import { PopularArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

type CurrencyPairProps = {
  currencyPair: CurrenyPairType;
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
      className="px-2 py-2 grid grid-flow-col grid-rows-1 justify-between items-center rounded-[35px] shadow-[5px_5px_10px_0px_rgba(0,0,0,0.7)] bg-[#2d2d2d] hover:shadow-[5px_5px_5px_0px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-300"
    >
      <Image
        width={45}
        height={45}
        src={currencyPair.valuteFrom.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name.ru}`}
      />

      <PopularArrowIcon width={12} />

      <Image
        width={45}
        height={45}
        src={currencyPair.valuteTo.icon_url}
        alt={`valute ${currencyPair.valuteFrom.name.ru}`}
      />
    </Link>
  );
};
