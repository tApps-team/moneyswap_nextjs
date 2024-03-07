"use client";

import { memo, useMemo } from "react";
import { City, Country, useCountryStore } from "@/entities/country";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";
import { useSelectsStore } from "@/entities/valute";
type CountryAccordionProps = {
  countries: Country[];
  show?: boolean;
  searchCountry: string;
};
export const CountryAccordion = memo((props: CountryAccordionProps) => {
  const { countries, show, searchCountry } = props;
  const setCountry = useCountryStore((state) => state.setCountry);
  const { setGiveSelect, setGetSelect } = useSelectsStore((state) => state);

  const handleCityClick = (city: City) => {
    setCountry(city);
    setGiveSelect(null);
    setGetSelect(null);
  };

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const countryName = country?.name?.ru.toLowerCase();
      const filteredCities = country.cities.filter((city) =>
        city?.name?.ru.toLowerCase().includes(searchCountry.toLowerCase()),
      );
      return countryName.includes(searchCountry.toLowerCase()) || filteredCities.length;
    });
  }, [countries, searchCountry]);

  const valueAccordion = useMemo(
    () => (searchCountry ? filteredCountries.map((el) => el.name.ru) : undefined),
    [filteredCountries, searchCountry],
  );
  return (
    <Accordion value={valueAccordion} className="w-full" type="multiple">
      {filteredCountries?.map((country) => (
        <AccordionItem className="text-nowrap" value={country?.name.ru} key={country?.id}>
          <AccordionTrigger>{country?.name.ru}</AccordionTrigger>
          <AccordionContent className="cursor-pointer text-base">
            {country?.cities.map((city) => (
              <div
                className="p-2 hover:bg-neutral-600 rounded"
                key={city.id}
                onClick={() => handleCityClick(city)}
              >
                {city?.name?.ru}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
});
