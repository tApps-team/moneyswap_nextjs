import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { GetDirectionsResponse } from "@/entities/currency";
import { ExchangeArrowIcon } from "@/shared/assets";
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
    <section className="bg-new-dark-grey rounded-[15px] mx-auto max-w-full mobile-xl:max-w-[80vw] md:max-w-full grid grid-rows-2 md:grid-rows-none md:grid-cols-2 xl:grid-cols-none lg:gap-x-[12vw] gap-x-12 gap-y-12 lg:p-8 md:p-6 py-8 px-4 w-full xl:p-10">
      <div className="grid grid-flow-row gap-8">
        <p className="mobile-xl:text-md md:text-sm xl:text-sm text-xs text-center font-normal uppercase">
          Топ популярных направлений
        </p>
        <div className="grid grid-cols-2 lg:gap-6 mobile-xl:gap-x-[15%] mobile-xl:mx-10 mx-0 md:mx-0 gap-6 justify-between items-center">
          {popularNoncashDirections?.map((direction, index) => (
            <Link
              href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              key={index}
              className="px-3 py-2 grid mobile-xl:min-w-24 gap-2 grid-flow-col mobile-xl:min-h-12 grid-rows-1 justify-between items-center bg-new-grey hover:scale-[1.025] hover:bg-new-light-grey transition-all duration-300 rounded-[12px]
              "
            >
              <figure className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  className="w-full h-full"
                  src={direction?.valute_from?.icon_url}
                  alt={direction?.valute_from?.code_name}
                  width={45}
                  height={45}
                />
              </figure>
              <div className="[&>svg]:w-4">
                <ExchangeArrowIcon />
              </div>
              <figure className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  className="w-full h-full"
                  src={direction?.valute_to?.icon_url}
                  alt={direction?.valute_to?.code_name}
                  width={45}
                  height={45}
                />
              </figure>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-flow-row gap-8">
        <p className="mobile-xl:text-md md:text-sm xl:text-sm text-xs text-center font-normal uppercase">
          Возможно, будет интересно
        </p>
        <div className="grid grid-cols-2 lg:gap-6 mobile-xl:gap-x-[15%] mobile-xl:mx-10 mx-0 md:mx-0 gap-6 justify-between items-center">
          {randomNoncashDirections?.map((direction, index) => (
            <Link
              href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              key={index}
              className="px-3 py-2 grid mobile-xl:min-w-24 gap-2 grid-flow-col mobile-xl:min-h-12 grid-rows-1 justify-between items-center bg-new-grey hover:scale-[1.025] hover:bg-new-light-grey transition-all duration-300 rounded-[12px]
              "
            >
              <figure className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  className="w-full h-full"
                  src={direction?.valute_from?.icon_url}
                  alt={direction?.valute_from?.code_name}
                  width={200}
                  height={200}
                />
              </figure>
              <div className="[&>svg]:w-4">
                <ExchangeArrowIcon />
              </div>
              <figure className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  className="w-full h-full"
                  src={direction?.valute_to?.icon_url}
                  alt={direction?.valute_to?.code_name}
                  width={200}
                  height={200}
                />
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
