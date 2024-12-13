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
      <section className="mobile-xl:py-[50px] pb-8 pt-0 grid md:grid-cols-2 gap-8">
        <div className="grid grid-flow-row gap-6 lg:mx-10 md:mx-0 mobile-xl:mx-8 mx-0">
          <p className="xl:text-lg lg:text-base mobile:text-sm text-xs font-normal xl:text-left text-center uppercase">
            Топ популярных направлений
          </p>
          <div className="grid mobile-xs:grid-cols-3 grid-cols-2 lg:gap-x-12 lg:gap-y-6 gap-3 mobile-xl:gap-x-8 mobile-xl:gap-y-4 items-center">
            {currentPopularDirections?.map((direction, index) => (
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
        <div className="grid grid-flow-row gap-6 lg:mx-10 md:mx-0 mobile-xl:mx-8 mx-0">
          <p className="xl:text-lg lg:text-base mobile:text-sm text-xs font-normal xl:text-left text-center uppercase">
            Возможно вам будет интересно
          </p>
          <div className="grid mobile-xs:grid-cols-3 grid-cols-2 lg:gap-x-12 lg:gap-y-6 gap-3 mobile-xl:gap-x-8 mobile-xl:gap-y-4 items-center">
            {currentRandomDirections?.map((direction, index) => (
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
      <section className="py-5 grid md:grid-cols-2 gap-8">
        <Link
          href={routes.buy}
          className="border-2 border-light-gray max-h-16 text-sm  rounded-full p-4 uppercase font-normal md:text-base text-center hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
        >
          Купить криптовалюту
        </Link>
        <Link
          href={routes.sell}
          className="border-2 border-light-gray max-h-16 rounded-full text-sm p-4 uppercase font-normal md:text-base text-center hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
        >
          Продать криптовалюту
        </Link>
      </section>
    </section>
  );
};
