import { create } from "zustand";

import { persist } from "zustand/middleware";
import { City, Country } from "../..";

type CountryStore = {
  city: City | null;
  setCountry: (city: City | null) => void;
};

export const useCountryStore = create<CountryStore>()((set) => ({
  city: null,
  setCountry: (city) => set({ city: city }),
}));
