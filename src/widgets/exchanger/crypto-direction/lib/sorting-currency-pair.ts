import { CurrencyPair } from "@/entities/currency";

export const sortingCurrencyPair = (currencyPair: CurrencyPair[]): CurrencyPair[] => {
  return currencyPair.sort((a, b) => b.pairCount - a.pairCount);
};
