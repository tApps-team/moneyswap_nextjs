import { FC } from "react";
// eslint-disable-next-line boundaries/element-types
import { CurrencyPair } from "@/features/currency";
import { GetDirectionsResponse } from "@/entities/currency";
import { ExchangerMarker } from "@/shared/types";

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
      <div className="grid grid-rows-[auto_1fr] gap-8">
        <p className="mobile-xl:text-md md:text-sm xl:text-sm text-xs text-center font-bold uppercase">
          Топ популярных направлений
        </p>
        <div className="grid mobile-xl:grid-cols-2 mobile:grid-cols-3 grid-cols-2 lg:gap-6 mobile-xl:gap-x-[15%] mobile-xl:mx-10 mx-0 md:mx-0 gap-6 justify-between items-center">
          {popularNoncashDirections?.map((direction, index) => (
            <CurrencyPair
              key={direction.valute_from.code_name + direction.valute_to.code_name + index}
              currencyPair={{
                direction_type: ExchangerMarker.no_cash,
                valuteFrom: direction.valute_from,
                valuteTo: direction.valute_to,
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-8">
        <p className="mobile-xl:text-md md:text-sm xl:text-sm text-xs text-center font-bold uppercase">
          Возможно, будет интересно
        </p>
        <div className="grid mobile-xl:grid-cols-2 mobile:grid-cols-3 grid-cols-2 lg:gap-6 mobile-xl:gap-x-[15%] mobile-xl:mx-10 mx-0 md:mx-0 gap-6 justify-between items-center">
          {randomNoncashDirections?.map((direction, index) => (
            <CurrencyPair
              key={direction.valute_from.code_name + direction.valute_to.code_name + index}
              currencyPair={{
                direction_type: ExchangerMarker.no_cash,
                valuteFrom: direction.valute_from,
                valuteTo: direction.valute_to,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
