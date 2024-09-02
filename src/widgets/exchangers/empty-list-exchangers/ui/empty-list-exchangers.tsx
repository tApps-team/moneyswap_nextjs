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
  console.log(similarCities);
  const createUrl = (valuteFrom: string, valuteTo: string) => {
    if (location) {
      return `/exchange/${valuteFrom}-to-${valuteTo}/${location.code_name}`;
    } else {
      return `/exchange/${valuteFrom}-to-${valuteTo}`;
    }
  };
  return (
    <div>
      <div className="uppercase my-6">
        <h2 className="text-xl">
          Лучшие курсы {valuteFrom.code_name} на {valuteTo.code_name}
        </h2>
        <p>
          На данный момент по направлению {valuteFrom.code_name} на {valuteTo.code_name} отсутствуют
          обменные пункты в городе {location?.code_name}. Попробуйте выбрать другое направление
          обмена в городе {location?.code_name}. Например, такие направления:
        </p>
      </div>
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]   flex flex-col w-full rounded-3xl text-white bg-[#2d2d2d]">
        {exchangers.length > 0 ? (
          exchangers?.map((exchanger) => (
            <Link
              key={exchanger.valute_from.code_name}
              className="border-b last:border-none"
              href={createUrl(exchanger.valute_from.code_name, exchanger.valute_to.code_name)}
            >
              <div className="flex justify-between items-center px-4 py-4 ">
                <div className="flex items-center gap-2">
                  <Image
                    src={exchanger.valute_from.icon_url}
                    alt={`valute ${exchanger.valute_from.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p>{exchanger.valute_from.code_name}</p>
                  <ChevronRightIcon color="white" height={32} width={32} />
                  <Image
                    src={exchanger.valute_to.icon_url}
                    alt={`valute ${exchanger.valute_to.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p>{exchanger.valute_to.code_name}</p>
                </div>

                <button className="border hover:bg-[#f6ff5f] hover:border-[#f6ff5f] hover:text-black hover:font-medium rounded-full px-5 py-3">
                  ПОКАЗАТЬ ОБМЕННИКИ
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full h-20 flex items-center justify-center">
            <p> Нет доступных обменников</p>
          </div>
        )}
      </div>
      {similarCities && similarCities?.length > 0 && (
        <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] mt-12 flex flex-col w-full rounded-3xl text-white bg-[#2d2d2d]">
          {similarCities?.map((city) => (
            <Link
              className="border-b last:border-none"
              key={city.pk}
              href={`/exchange/${valuteFrom}-to-${valuteTo}/${city.code_name}`}
            >
              <div className="flex justify-between items-center px-4 py-4 border-b last:border-none">
                <div className="flex items-center gap-2">
                  <p>{city.name}</p>
                  <ChevronRightIcon color="white" height={32} width={32} />
                  <p>{city.exchange_count} ОБМЕННИКОВ</p>
                </div>
                <button className="border hover:bg-[#f6ff5f] hover:border-[#f6ff5f] hover:text-black hover:font-medium rounded-full px-5 py-3">
                  ПОКАЗАТЬ ОБМЕННИКИ
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
