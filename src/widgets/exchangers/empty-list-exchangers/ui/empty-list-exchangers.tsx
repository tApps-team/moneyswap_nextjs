import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SpecificValute } from "@/entities/currency";
import { getSimilarDirections } from "@/entities/exchanger";
import { getSimilarCities } from "@/entities/location";
import { GetSpecificCityResponse } from "@/entities/location/country/api/country-api-dto";

type EmptyListExchangersProps = {
  valuteFrom: SpecificValute;
  valuteTo: SpecificValute;
  location?: GetSpecificCityResponse;
  limit?: number;
};

export const EmptyListExchangers = async (props: EmptyListExchangersProps) => {
  const { valuteFrom, valuteTo, location, limit } = props;

  const exchangers = await getSimilarDirections({
    valuteFrom: valuteTo.code_name,

    valuteTo: valuteTo.code_name,
    city: location?.code_name,
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
    <section className="mt-6">
      {exchangers.length > 0 && (
        <div className="uppercase  my-6  flex flex-col gap-2">
          <p className="mobile-xl:text-base text-xs font-medium text-start">
            На данный момент по направлению {valuteFrom.name.ru} ({valuteFrom.code_name}) на{" "}
            {valuteTo.name.ru} ({valuteTo.code_name}) отсутствуют обменные пункты в городе{" "}
            {location?.name.ru}. Попробуйте выбрать другое направление обмена в городе{" "}
            {location?.name.ru}. Например, такие направления:
          </p>
        </div>
      )}
      <div className=" flex flex-col w-full rounded-[15px] text-white bg-new-dark-grey">
        {exchangers.length > 0 ? (
          exchangers?.map((exchanger) => (
            <Link
              key={exchanger.valute_from.code_name + exchanger.valute_to.code_name}
              className="border-b border-[#34363A] last:border-none"
              href={createUrl(exchanger?.valute_from?.code_name, exchanger?.valute_to?.code_name)}
            >
              <div className="flex mobile-xl:flex-row mobile-xl:gap-0 gap-4  flex-col justify-between mobile-xl:items-center px-4 py-4 ">
                <div className="flex mx-auto mobile-xl:mx-0 items-center gap-2">
                  <Image
                    className="rounded-full mobile-xl:min-h-9 mobile-xl:min-w-9 size-7  overflow-hidden"
                    src={exchanger.valute_from.icon_url}
                    alt={`valute ${exchanger.valute_from.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p className="mobile-xl:text-base font-semibold text-xs">
                    {exchanger.valute_from.code_name}
                  </p>
                  <ChevronRightIcon
                    className="mobile-xl:size-8 size-5"
                    color="white"
                    height={32}
                    width={32}
                  />
                  <Image
                    className="rounded-full  mobile-xl:min-h-9 mobile-xl:min-w-9 size-7 overflow-hidden"
                    src={exchanger.valute_to.icon_url}
                    alt={`valute ${exchanger.valute_to.name.ru}`}
                    width={32}
                    height={32}
                  />
                  <p className="mobile-xl:text-base text-xs font-semibold">
                    {exchanger.valute_to.code_name}
                  </p>
                </div>
                <button className="border truncate  mobile-xl:text-base text-sm max-h-12 mobile-xl:h-12 h-9 whitespace-nowrap hover:bg-yellow-main hover:border-yellow-main hover:text-black hover:font-medium rounded-[10px] mobile-xl:px-5 mobile-xl:py-3 py-1 px-4">
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
          <p className="md:text-base text-xs font-medium">
            Попробуйте отменить фильтрацию по городу и посмотреть полный список доступных городов.
            Например, есть предложения по обмену {valuteFrom.name.ru} ({valuteFrom.code_name}) на{" "}
            {valuteTo.name.ru} ({valuteTo.code_name}) в городах:
          </p>

          <div className=" mt-6 flex flex-col w-full rounded-3xl text-white bg-new-dark-grey">
            {similarCities?.map((city) => (
              <Link
                className="border-b border-[#34363A] last:border-none"
                key={city.pk}
                href={`/exchange/${valuteFrom.code_name}-to-${valuteTo.code_name}?city=${city.code_name}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b last:border-none md:gap-0 gap-2">
                  <div className="flex items-center gap-2">
                    <p className="md:text-base text-xs font-medium">{city.name}</p>
                    <ChevronRightIcon color="#f6ff5f" height={32} width={32} />
                    <p className="md:text-base text-xs font-medium">
                      {city.exchange_count} ОБМЕННИКОВ
                    </p>
                  </div>
                  <button className="border truncate  mobile-xl:text-base text-sm max-h-12 mobile-xl:h-12 h-9 whitespace-nowrap hover:bg-yellow-main hover:border-yellow-main hover:text-black hover:font-medium rounded-[10px] mobile-xl:px-5 mobile-xl:py-3 py-1 px-4">
                    ПОКАЗАТЬ ОБМЕННИКИ
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
