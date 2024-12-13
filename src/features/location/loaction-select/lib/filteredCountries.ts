import { Country } from "@/entities/location";

export const filteredCountriesFn = (countries: Country[], searchValue: string) =>
  countries
    .map((country) => {
      const isCountryMatch =
        country.name.ru?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
        country.name.en.toLowerCase().includes(searchValue.toLowerCase());

      const filteredCities = country.cities.filter(
        (city) =>
          city.name.ru.toLowerCase().includes(searchValue.toLowerCase()) ||
          city.code_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          city.name.en.toLowerCase().includes(searchValue.toLowerCase()),
      );

      return {
        ...country,
        cities: isCountryMatch ? country.cities : filteredCities,
      };
    })
    .filter(
      (country) =>
        country.cities.length > 0 ||
        country.name.ru.toLowerCase().includes(searchValue.toLowerCase()),
    );
