import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Name } from "@/shared/types";
import { Country } from "../..";
export type Location = {
  cityCodeName: string;
  cityName: string;
  countryName: string;
  countryIconUrl: string;
  id: number;
};
type LocationState = {
  location: Location | null;
};

type LocationActions = {
  setLocation: (location: Location) => void;
};
/* persist */
// export const useLocationStore = create(
//   persist<LocationState & LocationActions>(
//     (set, get) => ({
//       location: null,
//       setLocation: (location) => set(() => ({ location: location })),
//     }),
//     { storage: createJSONStorage(() => sessionStorage), name: "location-storage" },
//   ),
// );
export const useLocationStore = create<LocationState & LocationActions>((set, get) => ({
  location: null,
  setLocation: (location) => set(() => ({ location: location })),
}));
