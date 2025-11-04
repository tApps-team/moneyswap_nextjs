"use client";

import { FC, useState } from "react";
import { Currency, CurrencyResponse } from "@/entities/currency";
import { Accordion, AccordionItem, AccordionTrigger } from "@/shared/ui";
import { filterList } from "../../model";
import { CurrenciesColumn } from "../currencies-column/currencies-column";

interface CurrenciesProps {
  currencies: CurrencyResponse[];
}

export const Currencies: FC<CurrenciesProps> = ({ currencies }) => {
  const [searchValueGive, setSearchValueGive] = useState<string>("");
  const [searchValueGet, setSearchValueGet] = useState<string>("");
  const [currencyInfoGive, setCurrencyInfoGive] = useState<Currency | null>(null);
  const [currencyInfoGet, setCurrencyInfoGet] = useState<Currency | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

  const filteredCurrenciesGive = filterList({
    list: currencies,
    searchValue: searchValueGive,
  });

  const filteredCurrenciesGet = filterList({
    list: currencies,
    searchValue: searchValueGet,
  });

  return (
    <div className="mt-10">
        <Accordion
          type="single"
          collapsible
          value={accordionOpen}
          onValueChange={setAccordionOpen}
          className="mt-3"
        >
            <AccordionItem value="currencies" className="border-none">
                <div className="grid grid-cols-2 gap-4">
                    <CurrenciesColumn
                        searchValue={searchValueGive}
                        setSearchValue={setSearchValueGive}
                        currencies={filteredCurrenciesGive || []}
                        currencyInfo={currencyInfoGet}
                        type="give"
                        setCurrencyInfo={setCurrencyInfoGive}
                        selectedCurrency={currencyInfoGive}
                    />
                    <CurrenciesColumn
                        searchValue={searchValueGet}
                        setSearchValue={setSearchValueGet}
                        currencies={filteredCurrenciesGet || []}
                        currencyInfo={currencyInfoGive}
                        type="get"
                        setCurrencyInfo={setCurrencyInfoGet}
                        selectedCurrency={currencyInfoGet}
                    />
                </div>
                <AccordionTrigger value="currencies" className="md:text-base mobile-xl:text-sm text-xs py-4 text-yellow-main justify-center">
                    {accordionOpen === "currencies" ? "Скрыть" : "Показать ещё"}
                </AccordionTrigger>
            </AccordionItem>
        </Accordion>
    </div>
  );
};
