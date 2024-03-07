"use client";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { Search } from "@/features/search";
import { Country, getCountries } from "@/entities/country";
import { useDebounce } from "@/shared/lib";
type CountriesListProps = {};

export const CountriesList = (props: CountriesListProps) => {
  const [searchCountry, setSearchCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);

  const searchCountryThrottled = useDebounce(searchCountry, 300);

  const onChange = useCallback((searchValue: string) => {
    setSearchCountry(searchValue);
  }, []);

  useEffect(() => {
    getCountries().then((countries) => setCountries(countries));
  }, []);

  return (
    <div>
      <Search onChange={onChange} searchValue={searchCountry} />
      <CountryAccordion show searchCountry={searchCountryThrottled} countries={countries} />
    </div>
  );
};
