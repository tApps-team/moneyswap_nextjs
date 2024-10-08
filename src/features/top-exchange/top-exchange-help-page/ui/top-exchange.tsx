import Link from "next/link";
import { FC } from "react";
import { GetDirectionsResponse } from "@/entities/currency";
import { PopularArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";

interface TopExchangeProps {
  popularNoncashDirections: GetDirectionsResponse;
  randomNoncashDirections: GetDirectionsResponse;
}

export const TopExchange: FC<TopExchangeProps> = ({
  popularNoncashDirections,
  randomNoncashDirections,
}) => {
  return (
    <section className="grid grid-rows-2 gap-12 w-full p-6 bg-[#2d2d2d] shadow-[1px_2px_8px_3px_rgba(0,0,0,0.5)] rounded-3xl">
      <div className="grid grid-flow-row gap-6">
        <p className="text-xs text-center font-medium uppercase">Топ популярных направлений</p>
        <div className="grid grid-cols-2 gap-6 items-center">
          {popularNoncashDirections?.map((direction, index) => (
            <Link
              href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              key={index}
              className="px-[10px] py-[8px] grid grid-flow-col gap-2 justify-between items-center rounded-[35px] shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)] bg-[#2d2d2d] hover:shadow-[1px_5px_15px_5px_rgba(0,0,0,0.5)] hover:scale-[1.01] transition-all duration-300"
            >
              <figure className="w-[40px] h-[40px]">
                <img
                  className="w-full h-full"
                  src={direction?.valute_from?.icon_url}
                  alt={direction?.valute_from?.code_name}
                />
              </figure>
              <PopularArrowIcon width={12} />
              <figure className="w-[40px] h-[40px]">
                <img
                  className="w-full h-full"
                  src={direction?.valute_to?.icon_url}
                  alt={direction?.valute_to?.code_name}
                />
              </figure>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-flow-row gap-6">
        <p className="text-xs text-center font-medium uppercase">Возможно вам будет интересно</p>
        <div className="grid grid-cols-2 gap-6 justify-between items-center">
          {randomNoncashDirections?.map((direction, index) => (
            <Link
              href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              key={index}
              className="px-[10px] py-[8px] grid grid-flow-col gap-2 justify-between items-center rounded-[35px] shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)] bg-[#2d2d2d] hover:shadow-[1px_5px_15px_5px_rgba(0,0,0,0.5)] hover:scale-[1.01] transition-all duration-300"
            >
              <figure className="w-[40px] h-[40px]">
                <img
                  className="w-full h-full"
                  src={direction?.valute_from?.icon_url}
                  alt={direction?.valute_from?.code_name}
                />
              </figure>
              <PopularArrowIcon width={12} />
              <figure className="w-[40px] h-[40px]">
                <img
                  className="w-full h-full"
                  src={direction?.valute_to?.icon_url}
                  alt={direction?.valute_to?.code_name}
                />
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
