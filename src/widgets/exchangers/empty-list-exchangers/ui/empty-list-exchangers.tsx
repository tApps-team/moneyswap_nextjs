import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Currency, ExchangeType } from "@/entities/currency";
import { getSimilarDirections } from "@/entities/exchanger";
import { Location, getSimilarCities } from "@/entities/location";
import { GetSpecificCityResponse } from "@/entities/location/country/api/country-api-dto";
type EmptyListExchangersProps = {
  valuteFrom: Currency;
  valuteTo: Currency;
  location?: GetSpecificCityResponse;
  exchangeMarker?: ExchangeType;
  limit?: number;
};
// img alt prop
export const EmptyListExchangers = async (props: EmptyListExchangersProps) => {
  const { valuteFrom, valuteTo, location, exchangeMarker, limit } = props;

  const exchangers = await getSimilarDirections({
    valuteFrom: valuteTo.code_name,

    valuteTo: valuteTo.code_name,
    city: location?.code_name,
    exchangeMarker,
    limit,
  });

  const similarCities = location
    ? await getSimilarCities({
        city: location.code_name,
        valute_to: valuteTo.code_name,
        vaute_from: valuteFrom.code_name,
      })
    : null;

  const createUrl = (valuteFrom: string, valuteTo: string) => {
    if (location) {
      return `/exchange/${valuteFrom}-to-${valuteTo}?city=${location?.code_name}`;
    } else {
      return `/exchange/${valuteFrom}-to-${valuteTo}`;
    }
  };
  return (
    <div className="mt-6">
      {exchangers.length > 0 && (
        <div className="uppercase my-6 line flex flex-col gap-2">
          <h2 className="text-xl font-medium">
            Лучшие курсы {valuteFrom.name.ru} ({valuteFrom.code_name}) на {valuteTo.name.ru} (
            {valuteTo.code_name})
          </h2>
          <p>
            На данный момент по направлению {valuteFrom.name.ru} ({valuteFrom.code_name}) на{" "}
            {valuteTo.name.ru} ({valuteTo.code_name}) отсутствуют обменные пункты в городе{" "}
            {location?.name.ru}. Попробуйте выбрать другое направление обмена в городе{" "}
            {location?.name.ru}. Например, такие направления:
          </p>
        </div>
      )}
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]   flex flex-col w-full rounded-3xl text-white bg-dark-gray">
        {exchangers.length > 0 ? (
          exchangers?.map((exchanger) => (
            <Link
              key={exchanger.valute_from.code_name + exchanger.valute_to.code_name}
              className="border-b last:border-none"
              href={createUrl(exchanger?.valute_from?.code_name, exchanger?.valute_to?.code_name)}
            >
              <div className="flex justify-between items-center px-4 py-4 ">
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full overflow-hidden"
                    src={exchanger.valute_from.icon_url}
                    alt={`valute ${exchanger.valute_from.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p>{exchanger.valute_from.code_name}</p>
                  <ChevronRightIcon color="white" height={32} width={32} />
                  <Image
                    className="rounded-full overflow-hidden"
                    src={exchanger.valute_to.icon_url}
                    alt={`valute ${exchanger.valute_to.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p>{exchanger.valute_to.code_name}</p>
                </div>

                <button className="border hover:bg-yellow-main hover:border-yellow-main hover:text-black hover:font-medium rounded-full px-5 py-3">
                  ПОКАЗАТЬ ОБМЕННИКИ
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full  h-20 flex items-center justify-center">
            <p> Нет доступных обменников</p>
          </div>
        )}
      </div>
      {similarCities && similarCities?.length > 0 && (
        <div className="mt-6 uppercase">
          <p>
            Попробуйте отменить фильтрацию по городу и посмотреть полный список доступных городов.
            Например, есть предложения по обмену {valuteFrom.name.ru} ({valuteFrom.code_name}) на{" "}
            {valuteTo.name.ru} ({valuteTo.code_name}) в городах:
          </p>

          <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] mt-6 flex flex-col w-full rounded-3xl text-white bg-dark-gray">
            {similarCities?.map((city) => (
              <Link
                className="border-b last:border-none"
                key={city.pk}
                href={`/exchange/${valuteFrom.code_name}-to-${valuteTo.code_name}?city=${city.code_name}`}
              >
                <div className="flex justify-between items-center px-4 py-4 border-b last:border-none">
                  <div className="flex items-center gap-2">
                    <p>{city.name}</p>
                    <ChevronRightIcon color="white" height={32} width={32} />
                    <p>{city.exchange_count} ОБМЕННИКОВ</p>
                  </div>
                  <button className="border hover:bg-yellow-main hover:border-yellow-main hover:text-black hover:font-medium rounded-full px-5 py-3">
                    ПОКАЗАТЬ ОБМЕННИКИ
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
