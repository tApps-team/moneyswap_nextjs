import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Currency } from "../types/currencyType";
type CurrencyState = {
  giveCurrency: Currency | null;
  giveCashCurrency: Currency | null;
  getCurrency: Currency | null;
  getCashCurrency: Currency | null;
};
type CurrecnyActions = {
  setGiveCurrency: (currency: Currency) => void;
  setCashGiveCurrency: (currency: Currency) => void;
  setGetCurrency: (currency: Currency) => void;
  setCashGetCurrency: (currency: Currency) => void;
  resetCashCurrencies: () => void;
  resetNoCashCurrencies: () => void;
};
/* Если понадобиться сохранять в sessionStorage */
// export const useCurrecnyStore = create(
//   persist<CurrencyState & CurrecnyActions>(
//     (set, get) => (),
//     { storage: createJSONStorage(() => sessionStorage), name: "currency-storage" },
//   ),
// );
export const useCurrecnyStore = create<CurrencyState & CurrecnyActions>((set) => ({
  getCurrency: null,
  giveCurrency: null,
  getCashCurrency: null,
  giveCashCurrency: null,
  setGetCurrency: (currency) => set(() => ({ getCurrency: currency })),
  setCashGetCurrency: (currency) => set(() => ({ getCashCurrency: currency })),
  setGiveCurrency: (currency) => set(() => ({ giveCurrency: currency })),
  setCashGiveCurrency: (currency) => set(() => ({ giveCashCurrency: currency })),
  resetCashCurrencies: () => set(() => ({ getCashCurrency: null, giveCashCurrency: null })),
  resetNoCashCurrencies: () => set(() => ({ getCurrency: null, giveCurrency: null })),
}));
