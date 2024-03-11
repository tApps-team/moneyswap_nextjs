import { create } from "zustand";

import { persist } from "zustand/middleware";
import { City, Country } from "../..";

type CountryStore = {
  country: Country | null;
  city: City | null;
  setCity: (city: City) => void;
  setCountry: (country: Country) => void;
};

export const useCountryStore = create<CountryStore>()((set) => ({
  city: null,
  country: null,
  setCity: (city) => set({ city: city }),
  setCountry: (country) => set({ country: country }),
}));
