"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  CityCard,
  Country,
  CountryCard,
  getCountries,
  useLocationStore,
} from "@/entities/location";
import { useDebounce } from "@/shared/lib";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/shared/ui";

export const CountryModal = () => {
  const country = useLocationStore((state) => state.country);
  const city = useLocationStore((state) => state.city);
  const setCity = useLocationStore((state) => state.setCity);

  const [countries, setCountries] = useState<Country[]>();
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
  const [searchCountry, setSearchCountry] = useState("");

  const debouncedSearchCountry = useDebounce(searchCountry);

  const handleChange = useCallback((value: string) => {
    setSearchCountry(value);
    setCurrentCountryId(null);
  }, []);

  const handleClick = useCallback((currentCountry: number) => {
    setCurrentCountryId(currentCountry);
  }, []);

  useEffect(() => {
    getCountries().then((countries) => setCountries(countries));
  }, []);

  const filteredCountries = useMemo(() => {
    return countries?.filter((country) => {
      const countryName = country?.name?.ru.toLowerCase();
      const filteredCities = country.cities.filter((city) =>
        city?.name?.ru.toLowerCase().includes(debouncedSearchCountry.toLowerCase()),
      );
      return countryName.includes(debouncedSearchCountry.toLowerCase()) || filteredCities.length;
    });
  }, [countries, debouncedSearchCountry]);

  const filteredCities = useMemo(() => {
    const selectedCountry = countries?.find((country) => country.id === currentCountryId);
    const selectedCities = selectedCountry?.cities.filter((city) =>
      city.name.ru.toLowerCase().includes(searchCountry.toLowerCase()),
    );

    return selectedCities?.length ? selectedCities : selectedCountry?.cities;
  }, [countries, currentCountryId, searchCountry]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {city ? (
          <Button>
            {/* <Image
              width={32}
              height={32}
              src={country.icon_url}
              alt={`country ${country.name.ru}`}
            /> */}
            <div>{`Город ${city?.name.ru}`}</div>
          </Button>
        ) : (
          <Button>Выберите город </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Выбрать город</DialogTitle>
          <Input
            value={searchCountry}
            onChange={(e) => handleChange(e.target.value.trim())}
            className="focus-visible:ring-transparent"
            placeholder="Поиск города и страны"
          />
        </DialogHeader>
        <div className="flex  min-h-[550px]">
          <div className="border w-96 max-h-[500px] rounded-lg overflow-y-scroll ">
            {filteredCountries?.length ? (
              filteredCountries?.map((country) => (
                <CountryCard onClick={handleClick} key={country.id} country={country} />
              ))
            ) : (
              <div>Список пуст</div>
            )}
          </div>
          <div className="border w-96 max-h-[500px] rounded-lg  overflow-y-scroll">
            {filteredCities ? (
              filteredCities?.map((city) => (
                <DialogClose asChild key={city.id}>
                  <CityCard onClick={setCity} city={city} />
                </DialogClose>
              ))
            ) : (
              <div>Список пуст</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
