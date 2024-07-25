import { Bitcoin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse, getAvailableValutes } from "@/entities/currency";
import useLocalStorage from "@/shared/lib/hooks/useLocalStorage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";

type CurrencySelectProps = {
  label?: string;
  disabled?: boolean;
  currencies?: CurrencyResponse[];
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { label, disabled, currencies = [] } = props;
  // const [currencies, setCurrencies] = useState<CurrencyResponse[] | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectCurrency, setSelectCurrency] = useLocalStorage<Currency | null>(label || "", null);
  const [amount, setAmount] = useLocalStorage<number | null>("amount", null);
  const searchDeferredValue = useDeferredValue(searchValue);

  const tabList: CurrencyResponse[] = [
    {
      name: { en: "All", ru: "Все" },
      currencies: currencies?.map((currency) => currency?.currencies).flat() || [],
      id: "All",
    },
    ...(currencies || []),
  ];

  const filteredTabList = tabList
    .map((tab) => ({
      ...tab,
      currencies: tab.currencies.filter(
        (currency) =>
          currency.name.en.toLowerCase().includes(searchDeferredValue.toLowerCase()) ||
          currency.name.ru.toLowerCase().includes(searchDeferredValue.toLowerCase()),
      ),
    }))
    .filter((tab) => tab.currencies.length > 0);

  return (
    <div>
      {label && <p>{label}</p>}
      <div className="flex items-center  rounded-md bg-[#2d3049] gap-10 justify-between py-2 px-4">
        <input
          disabled={disabled}
          type="number"
          className="bg-transparent"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
        />
        <Dialog>
          <DialogTrigger disabled={disabled}>
            <div className="bg-[#16192e] rounded-sm items-center p-2 flex">
              {selectCurrency ? (
                <Image
                  alt={`${selectCurrency.name} (${selectCurrency.code_name})`}
                  src={selectCurrency.icon_url}
                  width={32}
                  height={32}
                />
              ) : (
                <Bitcoin />
              )}

              <input
                readOnly
                className="bg-transparent "
                value={selectCurrency ? selectCurrency.name.ru : "Наличные руб"}
              />
              <ChevronDown />
            </div>
          </DialogTrigger>
          <DialogContent className="min-w-[800px] h-[600px]  ">
            <DialogTitle className="m-0">Выбор валюты</DialogTitle>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Поиск валюты"
            />
            <Tabs defaultValue={"Все"} className="h-[400px]   overflow-y-scroll">
              <TabsList>
                {filteredTabList.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.name.ru}>
                    {tab.name.ru}
                  </TabsTrigger>
                ))}
              </TabsList>
              {filteredTabList.map((tab) => (
                <TabsContent
                  className="grid mt-0 grid-rows-1 gap-2"
                  value={tab.name.ru}
                  key={tab.id}
                >
                  {tab.currencies.map((currency) => (
                    <DialogClose key={currency.id}>
                      <CurrencyCard
                        onClick={() => setSelectCurrency(currency)}
                        key={currency.id}
                        currency={currency}
                      />
                    </DialogClose>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
