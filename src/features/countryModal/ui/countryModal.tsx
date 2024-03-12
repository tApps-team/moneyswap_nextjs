"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CityCard, Country, CountryCard, getCountries, useCountryStore } from "@/entities/country";
import { useDebounce } from "@/shared/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/shared/ui";

export const CountryModal = () => {
  const country = useCountryStore((state) => state.country);
  const setCity = useCountryStore((state) => state.setCity);
  const city = useCountryStore((state) => state.city);
  const [countries, setCountries] = useState<Country[]>();
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
  const [searchCountry, setSearchCountry] = useState("");
  const debouncedSearchCountry = useDebounce(searchCountry);
  console.log(city);
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

    return selectedCountry?.cities;
  }, [countries, currentCountryId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {country ? (
          <Button>
            <Image
              width={32}
              height={32}
              src={country.icon_url}
              alt={`country ${country.name.ru}`}
            />
            <div>Выберите город</div>
          </Button>
        ) : (
          <Button>Выберите город </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Выбрать город</DialogTitle>
          <DialogDescription>
            <Input
              value={searchCountry}
              onChange={(e) => handleChange(e.target.value.trim())}
              className="focus-visible:ring-transparent"
              placeholder="Поиск города и страны"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex  min-h-[550px]">
          <div className="border w-96 max-h-[500px] rounded-lg overflow-y-scroll ">
            {filteredCountries?.map((country) => (
              <CountryCard onClick={handleClick} key={country.id} country={country} />
            ))}
          </div>
          <div className="border w-96 max-h-[500px] rounded-lg  overflow-y-scroll">
            {filteredCities?.map((city) => (
              <CityCard onClick={setCity} key={city.id} city={city} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
