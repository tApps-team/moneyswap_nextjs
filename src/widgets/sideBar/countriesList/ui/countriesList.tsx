"use client";
import { useCallback, useDeferredValue, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { Search } from "@/features/search";
import { Country, getCountries } from "@/entities/country";
import { useDebounce, useThrottle } from "@/shared/lib";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "@/shared/ui";
type CountriesListProps = {
  countries: Country[];
  show?: boolean;
};
export const CountriesList = (props: CountriesListProps) => {
  const { countries, show } = props;
  const [searchCountry, setSearchCountry] = useState("");
  //Todo Обсудить нужен ли throttle или нет
  const searchCountryThrottled = useDebounce(searchCountry, 300);

  const onChange = useCallback((searchValue: string) => {
    setSearchCountry(searchValue);
  }, []);

  return (
    <>
      {show ? (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open modal Accordion</Button>
            </DialogTrigger>
            <DialogContent className="min-w-[600px] overflow-y-scroll">
              <div className="min-h-[600px] max-h-[600px] ">
                <Input
                  className="text-slate-950 rounded-xl text-xl sticky top-0"
                  onChange={(e) => onChange(e.target.value.trim())}
                  value={searchCountry}
                  placeholder="Поиск страны и города"
                />
                <CountryAccordion
                  show
                  searchCountry={searchCountryThrottled}
                  countries={countries}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </>
  );
};
