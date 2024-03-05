import { create } from "zustand";
import { persist } from "zustand/middleware";
import { directions } from "@/shared/types";

//Store for SelectedDirection
interface DirectionStore {
  selectedDirection: directions;
  setSelectedDirection: (direction: directions) => void;
}

export const useDirectionStore = create<DirectionStore>()(
  // persist(
  //   (set) => ({
  //     selectedDirection: directions.noncash,
  //     setSelectedDirection: (direction) => set({ selectedDirection: direction }),
  //   }),
  //   { name: "direction-store" },
  // ),
  (set) => ({
    selectedDirection: directions.noncash,
    setSelectedDirection: (direction) => set({ selectedDirection: direction }),
  }),
);
