import Image from "next/image";
import Link from "next/link";
import { SpecificValute } from "@/entities/currency";
import { PopularArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";

type CurrencyPairProps = {
  valuteFrom: SpecificValute;
  valuteTo: SpecificValute;
  path?: string;
  iconWidth?: number;
  iconHeight?: number;
};
export const CurrencyPair = (props: CurrencyPairProps) => {
  const { valuteFrom, valuteTo, iconHeight, iconWidth, path } = props;

  return (
    <Link
      href={`${routes.home}exchange/${valuteFrom.code_name}-to-${valuteTo.code_name}`}
      className="px-2 py-2 grid grid-flow-col grid-rows-1 justify-between items-center rounded-[35px] shadow-[5px_5px_10px_0px_rgba(0,0,0,0.7)] bg-[#2d2d2d] hover:shadow-[5px_5px_5px_0px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-300"
    >
      <Image
        width={iconWidth || 45}
        height={iconHeight || 45}
        src={valuteFrom.icon_url}
        alt={`valute ${valuteFrom.name.ru}`}
      />

      <PopularArrowIcon width={12} />

      <Image
        width={iconWidth || 45}
        height={iconHeight || 45}
        src={valuteTo.icon_url}
        alt={`valute ${valuteFrom.name.ru}`}
      />
    </Link>
  );
};
