import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSimilarDirections } from "@/entities/exchanger";
import { GetSimilarDirectionDtoRequset } from "@/entities/exchanger/api/exchanger-api-dto";
import { getSimilarCities } from "@/entities/location";
import { Button } from "@/shared/ui";
type EmptyListExchangersProps = GetSimilarDirectionDtoRequset;
// img alt prop
export const EmptyListExchangers = async (props: EmptyListExchangersProps) => {
  const { valuteFrom, valuteTo, city, exchangeMarker, limit } = props;

  const exchangers = await getSimilarDirections({
    valuteFrom,
    valuteTo,
    city,
    exchangeMarker,
    limit,
  });
  const similarCities = city
    ? await getSimilarCities({ city: city, valute_to: valuteTo, vaute_from: valuteFrom })
    : null;
  console.log(similarCities);
  const createUrl = (valuteFrom: string, valuteTo: string) => {
    if (city) {
      return `/exchange/${valuteFrom}-to-${valuteTo}/${city}`;
    } else {
      return `/exchange/${valuteFrom}-to-${valuteTo}`;
    }
  };
  return (
    <div>
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]  mt-12 flex flex-col w-full rounded-3xl text-white bg-[#2d2d2d]">
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

                <button className="border rounded-full px-5 py-3">ПОКАЗАТЬ ОБМЕННИКИ</button>
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
                <button className="border rounded-full px-5 py-3">ПОКАЗАТЬ ОБМЕННИКИ</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};