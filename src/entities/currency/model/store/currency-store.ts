import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { Currency } from "../types/currencyType";
type CurrencyState = {
  giveCurrency: Currency | null;
  giveCashCurrency: Currency | null;
  getCurrency: Currency | null;
  getCashCurrency: Currency | null;
  getCurrencyAmount: number | null;
  giveCurrencyAmount: number | null;
  getCashCurrencyAmount: number | null;
  giveCashCurrencyAmount: number | null;
};
type CurrecnyActions = {
  setGiveCurrency: (currency: Currency | null) => void;
  setCashGiveCurrency: (currency: Currency | null) => void;
  setGetCurrency: (currency: Currency | null) => void;
  setCashGetCurrency: (currency: Currency | null) => void;
  resetCashCurrencies: () => void;
  resetNoCashCurrencies: () => void;
  setGetCurrencyAmount: (amount: number | null) => void;
  setGiveCurrencyAmount: (amount: number | null) => void;
  setGetCashCurrencyAmount: (amount: number | null) => void;
  setGiveCashCurrencyAmount: (amount: number | null) => void;
};
/* Если понадобиться сохранять в sessionStorage */
// export const useCurrecnyStore = create(
//   persist<CurrencyState & CurrecnyActions>(
//     (set, get) => (),
//     { storage: createJSONStorage(() => sessionStorage), name: "currency-storage" },
//   ),
// );
export const useCurrecnyStore = create<CurrencyState & CurrecnyActions>()(
  devtools((set) => ({
    getCurrency: null,
    giveCurrency: null,
    getCashCurrency: null,
    giveCashCurrency: null,
    getCashCurrencyAmount: null,
    getCurrencyAmount: null,
    giveCashCurrencyAmount: null,
    giveCurrencyAmount: null,

    setGetCurrency: (currency) => set(() => ({ getCurrency: currency })),
    setCashGetCurrency: (currency) => set(() => ({ getCashCurrency: currency })),
    setGiveCurrency: (currency) => set(() => ({ giveCurrency: currency })),
    setCashGiveCurrency: (currency) => set(() => ({ giveCashCurrency: currency })),

    resetCashCurrencies: () => set(() => ({ getCashCurrency: null, giveCashCurrency: null })),
    resetNoCashCurrencies: () => set(() => ({ getCurrency: null, giveCurrency: null })),

    setGiveCurrencyAmount: (amount) => set(() => ({ giveCurrencyAmount: amount })),
    setGetCurrencyAmount: (amount) => set(() => ({ getCurrencyAmount: amount })),
    setGetCashCurrencyAmount: (amount) => set(() => ({ getCashCurrencyAmount: amount })),
    setGiveCashCurrencyAmount: (amount) => set(() => ({ giveCashCurrencyAmount: amount })),
  })),
);
