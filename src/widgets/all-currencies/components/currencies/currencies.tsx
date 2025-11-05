"use client";

import { FC, useEffect, useState } from "react";
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
  // ✅ Открыт по умолчанию для SEO - роботы увидят все валюты сразу
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>("currencies");

  const filteredCurrenciesGive = filterList({
    list: currencies,
    searchValue: searchValueGive,
  });

  const filteredCurrenciesGet = filterList({
    list: currencies,
    searchValue: searchValueGet,
  });

  useEffect(() => {
    setAccordionOpen(undefined);
  }, []);

  return (
    <div className="mt-10">
        <Accordion
          type="single"
          collapsible
          value={accordionOpen}
          onValueChange={setAccordionOpen}
          className="lg:p-[50px] !pb-0 md:px-6 md:py-8 mobile-xl:px-8 mobile-xl:py-10 px-4 py-6 lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] bg-new-dark-grey"
        >
            <AccordionItem value="currencies" className="border-none">
                <div className="grid grid-cols-2 mobile-xl:gap-4 gap-2">
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
