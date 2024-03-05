"use client";
import { useCallback, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { Search } from "@/features/search";
import { Country, getCountries } from "@/entities/country";
import { useThrottle } from "@/shared/lib";
type CountriesListProps = {
  countries: Country[];
  show?: boolean;
};
export const CountriesList = (props: CountriesListProps) => {
  const { countries, show } = props;
  const [searchCountry, setSearchCountry] = useState("");
  //Todo Обсудить нужен ли throttle или нет
  const searchCountryThrottled = useThrottle(searchCountry, 500);

  const onChange = useCallback((searchValue: string) => {
    setSearchCountry(searchValue);
  }, []);

  return (
    <>
      {show ? (
        <div>
          <Search onChange={onChange} searchValue={searchCountry} />
          <CountryAccordion show searchCountry={searchCountryThrottled} countries={countries} />
        </div>
      ) : null}
    </>
  );
};
