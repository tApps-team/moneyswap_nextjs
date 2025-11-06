import { useState } from "react";
import { Currency, CurrencyFromCard, getAllValutes } from "@/entities/currency";
import { Currencies } from "../components";

export const AllCurrencies = async () => {
  const currencies = await getAllValutes();

  if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
    return null;
  }

  return (
    <Currencies currencies={currencies || []} />
  );
};