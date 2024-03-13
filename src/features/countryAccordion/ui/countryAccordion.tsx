"use client";

import { memo, useMemo } from "react";
import { City, Country, useCountryStore } from "@/entities/country";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DialogClose,
} from "@/shared/ui";
import { useSelectsStore } from "@/entities/valute";
type CountryAccordionProps = {
  countries: Country[];
  show?: boolean;
  searchCountry: string;
};
export const CountryAccordion = memo((props: CountryAccordionProps) => {
  const { countries, show, searchCountry } = props;
  const { setCountry, setCity } = useCountryStore((state) => state);
  const { setGiveSelect, setGetSelect } = useSelectsStore((state) => state);

  const handleCityClick = (city: City) => {
    setCity(city);
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
    <Accordion value={valueAccordion} type="multiple">
      {filteredCountries?.map((country) => (
        <AccordionItem className="text-nowrap" value={country?.name.ru} key={country?.id}>
          <AccordionTrigger>{country?.name.ru}</AccordionTrigger>
          <AccordionContent
            className="cursor-pointer text-base "
            onClick={() => setCountry(country)}
          >
            {country?.cities.map((city) => (
              <DialogClose asChild key={city.id}>
                <div
                  onClick={() => handleCityClick(city)}
                  className="p-2 hover:bg-neutral-600 rounded"
                >
                  {city?.name?.ru}
                </div>
              </DialogClose>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
});
