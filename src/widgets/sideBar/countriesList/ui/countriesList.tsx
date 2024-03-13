"use client";

import { useCallback, useEffect, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { Country, getCountries, useCountryStore } from "@/entities/country";
import { useDebounce } from "@/shared/lib";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "@/shared/ui";

type CountriesListProps = {};

export const CountriesList = (props: CountriesListProps) => {
  const [searchCountry, setSearchCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);

  const city = useCountryStore((state) => state.city);
  const country = useCountryStore((state) => state.country);

  const searchCountryThrottled = useDebounce(searchCountry, 300);

  const onChange = useCallback((searchValue: string) => {
    setSearchCountry(searchValue);
  }, []);

  useEffect(() => {
    getCountries().then((countries) => setCountries(countries));
  }, []);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">
            {country ? `Старна ${country.name.ru}` : "Выберите страну"}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] overflow-y-scroll">
          <div className="min-h-[600px] max-h-[600px] ">
            <Input
              className="text-slate-950 rounded-xl text-xl sticky top-0"
              onChange={(e) => onChange(e.target.value.trim())}
              value={searchCountry}
              placeholder="Поиск страны и города"
            />
            <CountryAccordion show searchCountry={searchCountryThrottled} countries={countries} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
