import { ChevronDown, ChevronRight } from "lucide-react";
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
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, Input } from "@/shared/ui";
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
      <DialogTrigger>
        <div className="bg-[#2d3049] rounded-sm p-2 flex justify-between items-center gap-2">
          {location && (
            <Image
              alt={`${location?.cityCodeName})`}
              src={location?.countryIconUrl}
              width={32}
              height={32}
            />
          )}

          <input readOnly value={location?.cityName} className="bg-transparent truncate  " />
          <div>
            <ChevronDown color="white" height={32} width={32} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] h-[600px]  ">
        <DialogTitle className="m-0">Выбрать город</DialogTitle>
        <Input
          value={locationSearchValue}
          onChange={(e) => setLocationSearchValue(e.target.value)}
          placeholder="Поиск города и страны"
        />
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
            <div className="border rounded-sm  flex flex-col gap-3  overflow-y-scroll ">
              {countries?.map((country) => (
                <CountryCard
                  active={country.id === location?.id}
                  key={country.id}
                  onClick={() => onClickCountry(country)}
                  country={country}
                />
              ))}
            </div>
            <ChevronRight width={62} height={52} className="self-center" />
            <div className="border rounded-sm  flex flex-col gap-3  overflow-y-scroll ">
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
                  />
                </DialogClose>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
