import { create } from "zustand";
import { directions } from "@/shared/types";

type DirectionState = {
  direction: directions;
};
type DirectionActions = {
  setDirection: (direction: directions) => void;
};
/* Если понадобиться сохранять в sessionStorage */
// export const useCurrecnyStore = create(
//   persist<CurrencyState & CurrecnyActions>(
//     (set, get) => (),
//     { storage: createJSONStorage(() => sessionStorage), name: "currency-storage" },
//   ),
// );
export const useDirectionStore = create<DirectionState & DirectionActions>((set) => ({
  direction: directions.noncash,
  setDirection: (direction) => set(() => ({ direction: direction })),
}));
