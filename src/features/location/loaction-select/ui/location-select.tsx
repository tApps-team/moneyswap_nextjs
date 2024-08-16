import { ChevronDown, ChevronRight, CircleSlash2, SearchIcon } from "lucide-react";
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
  const filteredCountries = useMemo(
    () =>
      countries &&
      countries
        .map((country) => {
          const isCountryMatch = country?.name?.ru
            ?.toLowerCase()
            ?.includes(locationSearchValue?.toLowerCase());

          const filteredCountry = {
            ...country,
            cities: isCountryMatch
              ? country.cities
              : country.cities.filter((city) =>
                  city?.name?.ru?.toLowerCase()?.includes(locationSearchValue?.toLowerCase()),
                ),
          };
          if (isCountryMatch || filteredCountry?.cities?.length > 0) {
            return filteredCountry;
          }
          return null;
        })
        .filter((country): country is Country => country !== null),
    [countries, locationSearchValue],
  );
  const cityList = useMemo(() => {
    return selectCountry && countries.find((country) => country.id === selectCountry.id);
  }, [countries, selectCountry]);

  const filteredLocation = useMemo(() => {
    const searchValueToLowerCase = debouncedLocationSearchValue.toLowerCase();
    return countries.flatMap((country) => {
      const cities = country.cities.filter((city) => city.name.ru.includes(searchValueToLowerCase));
      if (cities.length > 0) return { country, cities };
    });
  }, [countries, debouncedLocationSearchValue]);

  return (
    <Dialog>
      <DialogTrigger className="" asChild>
        <div className="bg-[#2d2d2d]  rounded-full h-16 border-2 gap-2 border-[#bbbbbb] items-center p-3 flex justify-between">
          <div className="flex items-center gap-4">
            {location ? (
              <figure className="w-[36px] h-[36px]">
                <Image
                  alt={`${location?.cityCodeName})`}
                  src={location?.countryIconUrl}
                  width={36}
                  height={36}
                />
              </figure>
            ) : (
              <CircleSlash2 width={36} height={36} stroke="#bbb" strokeWidth={"1.5px"} />
            )}

            <p className=" truncate uppercase">{location ? location?.cityName : "Не выбрано..."}</p>
          </div>
          <div>
            <ChevronDown color="white" height={32} width={32} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#2d2d2d]  border-none w-[50svw] h-[65svh] rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] grid gap-6">
        <div className="grid grid-cols-2 grid-rows-1 items-center">
          <DialogTitle className="m-0 uppercase">Выбор города</DialogTitle>
          <div className="relative">
            <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
            <Input
              className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-[#bbbbbb] placeholder:font-semibold border-[#bbbbbb]"
              value={locationSearchValue}
              onChange={(e) => setLocationSearchValue(e.target.value)}
              placeholder="Поиск города и страны"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr,50px,1fr] grid-rows-1 min-h-full  ">
          <ScrollArea className="h-[50svh] border rounded-3xl p-4">
            <div className="flex flex-col gap-3">
              {filteredCountries?.map((country) => (
                <CountryCard
                  active={country.name.ru === location?.countryName}
                  key={country.id}
                  onClick={() => onClickCountry(country)}
                  country={country}
                />
              ))}
            </div>
          </ScrollArea>

          <ChevronRight width={50} className="self-center" />
          <ScrollArea className="h-[50svh] border rounded-3xl p-4">
            <div className="  flex flex-col gap-3 ">
              {cityList?.cities.map((city) => (
                <DialogClose key={city.id}>
                  <CityCard
                    onClick={() =>
                      onClickCity({
                        cityCodeName: city?.code_name,
                        countryIconUrl: cityList?.icon_url,
                        countryName: cityList?.name?.ru,
                        cityName: city?.name?.ru,
                        id: city?.id,
                      })
                    }
                    city={city}
                    active={location?.cityCodeName === city?.code_name}
                  />
                </DialogClose>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
