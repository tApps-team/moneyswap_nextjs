import { MapPin } from "lucide-react";
import Link from "next/link";
import { getAllSimilarCities } from "@/entities/location";
import { routes } from "@/shared/router";
import { ScrollArea } from "@/shared/ui";

export const SimilarCities = async (props: { city: string, valute_from: string, valute_to: string }) => {
  const { city, valute_from, valute_to } = props;
  const similarCities = await getAllSimilarCities({
    city,
    valute_to,
    valute_from,
  });

  if (!similarCities || !Array.isArray(similarCities) || similarCities.length === 0) {
    return null;
  }
  

  return (
    <div className="flex flex-col gap-4 mt-10">
      <h2 className="xl:text-3xl lg:text-2xl md:text-xl text-base mobile-xl:font-medium font-semibold">
        По выбранному направлению криптообменники работают в городах:
      </h2>
      <ScrollArea className="max-h-[300px] overflow-auto lg:p-[50px] md:px-6 md:py-8 mobile-xl:px-8 mobile-xl:py-10 px-4 py-6 lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] bg-new-dark-grey">
        <div className="flex flex-wrap gap-3">
          {similarCities && similarCities?.map((cityItem) => (
            <Link
              key={cityItem?.pk}
              href={{
                pathname: `${routes.exchange}/${valute_from}-to-${valute_to}`,
                query: { city: cityItem?.code_name },
              }}
              scroll={true}
              className="w-fit flex items-center gap-1 md:py-2 md:px-3 py-1 px-2 hover:bg-yellow-main group bg-new-grey hover:scale-[1.025] transition-all duration-300 mobile-xl:rounded-[12px] rounded-[7.5px] text-white hover:text-black"
            >
              <MapPin className="size-4 text-blue-600 group-hover:text-black flex-shrink-0" />
              <p className="lg:text-sm text-xs truncate">
                {cityItem?.name}
              </p>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};