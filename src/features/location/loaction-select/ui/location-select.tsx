import { ChevronDown, ChevronRight, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCurrecnyStore } from "@/entities/currency";
import {
  City,
  CityCard,
  Country,
  CountryCard,
  Location,
  useLocationStore,
} from "@/entities/location";
import { useDebounce } from "@/shared/lib";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  ScrollArea,
} from "@/shared/ui";
type LocationSelectProps = {
  countries: Country[];
};
export const LocationSelect = (props: LocationSelectProps) => {
  const { countries } = props;
  const { location, setLocation } = useLocationStore((state) => state);

  const resetCashCurrencies = useCurrecnyStore((state) => state.resetCashCurrencies);
  const [selectCountry, setSelectCountry] = useState<Country | null>(null);
  const [locationSearchValue, setLocationSearchValue] = useState<string>("");
  const debouncedLocationSearchValue = useDebounce(locationSearchValue, 500);
  const onClickCountry = (country: Country) => {
    setSelectCountry(country);
  };
  const onClickCity = (location: Location) => {
    setLocation(location);
    resetCashCurrencies();
  };
  const cityList = useMemo(() => {
    return selectCountry && countries.find((country) => country.id === selectCountry.id);
  }, [countries, selectCountry]);

  const filteredLocation = useMemo(() => {
    const searchValueToLowerCase = debouncedLocationSearchValue.toLowerCase();
    return countries.flatMap((country) =>
      country.cities
        .filter((city) => city.name.ru.toLowerCase().includes(searchValueToLowerCase))
        .map((location) => {
          return {
            ...location,
            country,
          };
        }),
    );
  }, [countries, debouncedLocationSearchValue]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-[#2d2d2d] h-[60px] rounded-full border gap-2 border-[#bbbbbb] items-center p-2 flex ">
          {location && (
            <Image
              alt={`${location?.cityCodeName})`}
              src={location?.countryIconUrl}
              width={32}
              height={32}
            />
          )}

          <input
            readOnly
            value={location?.cityName}
            className="bg-transparent truncate max-w-[100px]  "
          />
          <div>
            <ChevronDown color="white" height={32} width={32} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#2d2d2d] border-none w-[960px] h-[480px] shadow-black shadow-2xl rounded-2xl  grid  ">
        <div className="grid grid-cols-2 grid-rows-1 items-center">
          <DialogTitle className="m-0 uppercase">Выбор города</DialogTitle>
          <div className="relative">
            <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
            <Input
              className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-[#bbbbbb] placeholder:font-bold border-[#bbbbbb]"
              value={locationSearchValue}
              onChange={(e) => setLocationSearchValue(e.target.value)}
              placeholder="Поиск города и страны"
            />
          </div>
        </div>
        {debouncedLocationSearchValue ? (
          <div className="overflow-y-scroll flex flex-col gap-4 border rounded p-4">
            {filteredLocation.map((city) => (
              <div key={city.id} className="flex items-center gap-2 border">
                <p>{city.name.ru}</p>
                (
                <Image
                  src={city.country.icon_url}
                  alt={`${city.country.name.ru}`}
                  width={32}
                  height={32}
                />
                <p>{city.country.name.ru}</p>)
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[1fr,50px,1fr] grid-rows-1 min-h-full  ">
            <ScrollArea className="h-full border rounded-2xl p-4 ">
              <div className="flex flex-col gap-3">
                {[...countries, ...countries, ...countries]?.map((country) => (
                  <CountryCard
                    active={country.id === location?.id}
                    key={country.id}
                    onClick={() => onClickCountry(country)}
                    country={country}
                  />
                ))}
              </div>
            </ScrollArea>

            <ChevronRight width={62} height={52} className="self-center" />
            <ScrollArea className="h-full border rounded-2xl p-4">
              <div className="  flex flex-col gap-3 ">
                {cityList?.cities.map((city) => (
                  <DialogClose key={city.id}>
                    <CityCard
                      onClick={() =>
                        onClickCity({
                          cityCodeName: city.code_name,
                          countryIconUrl: cityList.icon_url,
                          countryName: cityList.name.ru,
                          cityName: city.name.ru,
                          id: city.id,
                        })
                      }
                      city={city}
                      active={location?.cityCodeName === city.code_name}
                    />
                  </DialogClose>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
