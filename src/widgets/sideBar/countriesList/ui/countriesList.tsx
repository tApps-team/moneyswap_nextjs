"use client";
import { useCallback, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { Search } from "@/features/search";
import { Country, getCountries } from "@/entities/country";
type CountriesListProps = {
  countries: Country[];
};
export const CountriesList = (props: CountriesListProps) => {
  const { countries } = props;
  const [searchCountry, setSearchCountry] = useState("");

  const onChange = useCallback((searchValue: string) => {
    setSearchCountry(searchValue);
  }, []);

  return (
    <div>
      <Search onChange={onChange} searchValue={searchCountry} />
      <CountryAccordion show searchCountry={searchCountry} countries={countries} />
    </div>
  );
};
