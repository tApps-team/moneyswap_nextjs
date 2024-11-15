import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
// eslint-disable-next-line boundaries/element-types
import { CurrencyPair } from "@/features/currency/currency-pair";
import { GetDirectionsResponse } from "@/entities/currency";
import { PopularArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { ExchangerMarker, directions } from "@/shared/types";

interface TopExchangeProps {
  popularCashDirections: GetDirectionsResponse;
  popularNoncashDirections: GetDirectionsResponse;
  randomCashDirections: GetDirectionsResponse;
  randomNoncashDirections: GetDirectionsResponse;
  direction: ExchangerMarker;
}

export const TopExchange: FC<TopExchangeProps> = ({
  popularCashDirections,
  popularNoncashDirections,
  randomCashDirections,
  randomNoncashDirections,
  direction,
}) => {
  // надо знать нал/безнал
  const currentDirection = direction;
  const currentPopularDirections =
    currentDirection === ExchangerMarker.cash ? popularCashDirections : popularNoncashDirections;
  const currentRandomDirections =
    currentDirection === ExchangerMarker.cash ? randomCashDirections : randomNoncashDirections;
  return (
    <section>
      <section className="mobile-xl:py-[50px] pb-8 pt-0 grid mobile-xl:grid-cols-2 gap-8">
        <div className="grid grid-flow-row gap-6 mobile-xl:mx-10 mx-3">
          <p className="mobile-xl:text-lg mobile-xs:text-sm text-xs mobile-xl:font-medium font-semibold mobile-xl:text-left text-center uppercase">
            Топ популярных направлений
          </p>
          <div className="grid grid-cols-3 mobile-xl:gap-x-12 mobile-xl:gap-y-6 gap-3 items-center">
            {currentPopularDirections?.map((direction, index) => (
              // <Link
              //   href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              //   key={index}
              //   className="px-[10px] py-[8px] grid grid-flow-col gap-2 justify-between items-center rounded-[35px] shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)] bg-dark-gray hover:shadow-[1px_5px_15px_5px_rgba(0,0,0,0.5)] hover:scale-[1.01] transition-all duration-300"
              // >
              //   <figure className="w-[45px] h-[45px] rounded-full overflow-hidden">
              //     <Image
              //       className="w-full h-full"
              //       src={direction?.valute_from?.icon_url}
              //       alt={direction?.valute_from?.code_name}
              //       width={200}
              //       height={200}
              //     />
              //   </figure>
              //   <PopularArrowIcon width={12} />
              //   <figure className="w-[45px] h-[45px] rounded-full overflow-hidden">
              //     <Image
              //       className="w-full h-full"
              //       src={direction?.valute_to?.icon_url}
              //       alt={direction?.valute_to?.code_name}
              //       width={200}
              //       height={200}
              //     />
              //   </figure>
              // </Link>
              <CurrencyPair
                key={direction.valute_from.code_name + direction.valute_to.code_name + index}
                currencyPair={{
                  direction_type: currentDirection,
                  valuteFrom: direction.valute_from,
                  valuteTo: direction.valute_to,
                }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-flow-row gap-6 mobile-xl:mx-10 mx-3">
          <p className="mobile-xl:text-lg mobile-xs:text-sm text-xs mobile-xl:font-medium font-semibold mobile-xl:text-left text-center uppercase">
            Возможно вам будет интересно
          </p>
          <div className="grid grid-cols-3 mobile-xl:gap-x-12 mobile-xl:gap-y-6 gap-3 justify-between items-center">
            {currentRandomDirections?.map((direction, index) => (
              // <Link
              //   href={`${routes.exchange}/${direction?.valute_from?.code_name}-to-${direction?.valute_to?.code_name}`}
              //   key={index}
              //   className="px-[10px] py-[8px] grid grid-flow-col gap-2 justify-between items-center rounded-[35px] shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)] bg-dark-gray hover:shadow-[1px_5px_15px_5px_rgba(0,0,0,0.5)] hover:scale-[1.01] transition-all duration-300"
              // >
              //   <figure className="w-[45px] h-[45px] rounded-full overflow-hidden">
              //     <Image
              //       className="w-full h-full"
              //       src={direction?.valute_from?.icon_url}
              //       alt={direction?.valute_from?.code_name}
              //       width={200}
              //       height={200}
              //     />
              //   </figure>
              //   <PopularArrowIcon width={12} />
              //   <figure className="w-[45px] h-[45px] rounded-full overflow-hidden">
              //     <Image
              //       className="w-full h-full"
              //       src={direction?.valute_to?.icon_url}
              //       alt={direction?.valute_to?.code_name}
              //       width={200}
              //       height={200}
              //     />
              //   </figure>
              // </Link>
              <CurrencyPair
                key={direction.valute_from.code_name + direction.valute_to.code_name + index}
                currencyPair={{
                  direction_type: currentDirection,
                  valuteFrom: direction.valute_from,
                  valuteTo: direction.valute_to,
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-5 grid mobile-xl:grid-cols-2 gap-8">
        <Link
          href={routes.buy}
          className="border-2 border-light-gray max-h-16  rounded-full p-4 uppercase font-medium text-base text-center hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
        >
          Купить криптовалюту
        </Link>
        <Link
          href={routes.sell}
          className="border-2 border-light-gray max-h-16 rounded-full p-4 uppercase font-medium text-base text-center hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
        >
          Продать криптовалюту
        </Link>
      </section>
    </section>
  );
};
