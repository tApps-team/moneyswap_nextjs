import { cx } from "class-variance-authority";
import { Bitcoin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse, useCurrecnyStore } from "@/entities/currency";
import useLocalStorage from "@/shared/lib/hooks/useLocalStorage";
import { directions } from "@/shared/types";
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
  currencyInfo?: Currency | null;
  onClick: (currency: Currency) => void;
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { label, disabled, currencies, currencyInfo, onClick } = props;
  const [searchValue, setSearchValue] = useState<string>("");

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
    ?.map((tab) => ({
      ...tab,
      currencies: tab?.currencies?.filter(
        (currency) =>
          currency.name.en.toLowerCase().includes(searchDeferredValue.toLowerCase()) ||
          currency.name.ru.toLowerCase().includes(searchDeferredValue.toLowerCase()),
      ),
    }))
    .filter((tab) => tab?.currencies?.length > 0);

  return (
    <div className={cx("flex flex-col ", disabled && "pointer-events-none ")}>
      {label && <p className="uppercase">{label}</p>}
      <div className="flex items-center border border-[#bbbbbb]  rounded-full bg-gradient-to-l from-[#606060] gap-10 justify-between  ">
        <input
          disabled={disabled}
          type="number"
          className="bg-transparent text-[#f6ff5f] px-6 "
          value={amount || ""}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
        />
        <Dialog>
          <DialogTrigger disabled={disabled}>
            <div className="bg-[#2d2d2d]  rounded-full items-center p-2 flex h-full">
              <div className="flex gap-2">
                {currencyInfo ? (
                  <Image
                    alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                    src={currencyInfo?.icon_url}
                    width={32}
                    height={32}
                  />
                ) : (
                  <Bitcoin />
                )}
                {/* <div className="flex flex-col items-start">
                <div>{currencyInfo?.name?.ru}</div>
                <div>{currencyInfo?.code_name}</div>
              </div> */}
                <input
                  readOnly
                  className="bg-transparent "
                  value={currencyInfo ? currencyInfo?.name?.ru : "Наличные руб"}
                />
              </div>
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
                        onClick={() => onClick(currency)}
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
