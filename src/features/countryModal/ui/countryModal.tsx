"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CityCard, Country, CountryCard, getCountries, useCountryStore } from "@/entities/country";
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
  const [countries, setCountries] = useState<Country[]>();
  const [searchCountry, setSearchCountry] = useState("");
  const [currentCountryId, setCurrentCountryId] = useState<number | null>(null);
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
  console.log(currentCountryId);
  const filteredCountries = useMemo(() => {
    return countries?.filter((country) => {
      const countryName = country?.name?.ru.toLowerCase();
      const filteredCities = country.cities.filter((city) =>
        city?.name?.ru.toLowerCase().includes(searchCountry.toLowerCase()),
      );
      return countryName.includes(searchCountry.toLowerCase()) || filteredCities.length;
    });
  }, [countries, searchCountry]);

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
              onChange={(e) => handleChange(e.target.value)}
              className="focus-visible:ring-transparent"
              placeholder="Поиск города и страны"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="border w-96 max-h-[300px] rounded-lg overflow-y-scroll ">
            {filteredCountries?.map((country) => (
              <CountryCard onClick={handleClick} key={country.id} country={country} />
            ))}
          </div>
          <div className="border w-96 max-h-[300px] rounded-lg  overflow-y-scroll">
            {filteredCities?.map((city) => <CityCard key={city.id} city={city} />)}
          </div>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
