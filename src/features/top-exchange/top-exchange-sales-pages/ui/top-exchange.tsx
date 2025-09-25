import Link from "next/link";
import { FC } from "react";
// eslint-disable-next-line boundaries/element-types
import { CurrencyPair } from "@/features/currency";
import { getPopularValutes, getRandomValutes } from "@/entities/currency";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

interface TopExchangeSaleProps {
  direction: Exclude<ExchangerMarker, ExchangerMarker.both | ExchangerMarker.partner>;
}

export const TopExchangeSale: FC<TopExchangeSaleProps> = async ({ direction }) => {
  const popularCashDirections = await getPopularValutes({
    exchange_marker: ExchangerMarker.cash,
    limit: 6,
  });
  const popularNoncashDirections = await getPopularValutes({
    exchange_marker: ExchangerMarker.no_cash,
    limit: 6,
  });
  const randomCashDirections = await getRandomValutes({
    exchange_marker: ExchangerMarker.cash,
    limit: 6,
  });
  const randomNoncashDirections = await getRandomValutes({
    exchange_marker: ExchangerMarker.no_cash,
    limit: 6,
  });

  // надо знать нал/безнал
  const currentDirection = direction;
  const currentPopularDirections =
    currentDirection === ExchangerMarker.cash ? popularCashDirections : popularNoncashDirections;
  const currentRandomDirections =
    currentDirection === ExchangerMarker.cash ? randomCashDirections : randomNoncashDirections;
  return (
    <section className="grid grid-flow-row gap-10">
      <section className="mobile-xl:mt-[50px] mt-10 lg:p-[50px] md:px-6 md:py-8 mobile-xl:px-8 mobile-xl:py-10 px-4 py-6 grid md:grid-cols-2 grid-cols-1 lg:gap-[8%] gap-8 lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] bg-new-dark-grey">
        <div className="grid grid-flow-row mobile-xl:gap-6 gap-5">
          <p className="text-yellow-main xl:text-xl lg:text-base text-sm font-bold uppercase mobile-xl:text-start text-center">
            Топ популярных направлений
          </p>
          <div className="grid mobile:grid-cols-3 grid-cols-2 lg:gap-x-7 lg:gap-y-5 md:gap-x-4 mobile-xl:gap-x-[8%] mobile-xl:gap-y-4 gap-y-3 gap-x-2 items-center">
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
        <div className="grid grid-flow-row mobile-xl:gap-6 gap-5">
          <p className="text-yellow-main xl:text-xl lg:text-base text-sm font-bold uppercase mobile-xl:text-start text-center">
            Возможно будет интересно
          </p>
          <div className="grid mobile:grid-cols-3 grid-cols-2 lg:gap-x-7 lg:gap-y-5 md:gap-x-4 mobile-xl:gap-x-[8%] mobile-xl:gap-y-4 gap-y-3 gap-x-2 items-center">
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
      <section className="flex justify-center items-center">
        <div className="grid mobile-xl:grid-cols-2 gap-2 justify-center justify-items-stretch">
          <Link
            href={routes.home}
            className="bg-yellow-main text-black text-sm rounded-[10px] p-4 font-normal md:text-base text-center hover:bg-yellow-main hover:scale-[1.05] transition-all duration-300"
          >
            Купить криптовалюту
          </Link>
          <Link
            href={routes.home}
            className="bg-yellow-main text-black text-sm rounded-[10px] p-4 font-normal md:text-base text-center hover:bg-yellow-main hover:scale-[1.05] transition-all duration-300"
          >
            Продать криптовалюту
          </Link>
        </div>
      </section>
    </section>
  );
};
