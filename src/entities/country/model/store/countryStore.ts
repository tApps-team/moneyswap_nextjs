import { create } from "zustand";

import { persist } from "zustand/middleware";
import { Country } from "../..";

type CountryStore = {
  country: Country | null;
  setCountry: (country: Country) => void;
};

export const useCountryStore = create<CountryStore>()((set) => ({
  country: null,
  setCountry: (country) => set({ country: country }),
}));
