import { cx } from "class-variance-authority";
import { Bitcoin, ChevronDown, SearchIcon } from "lucide-react";
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
  ScrollArea,
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
    <div className={cx("flex flex-col  ", disabled && "pointer-events-none ")}>
      {label && <p className="uppercase">{label}</p>}
      <div className="flex items-center border border-[#bbbbbb]  rounded-full bg-gradient-to-l from-[#606060] gap-10 justify-between  ">
        <input
          disabled={disabled}
          type="number"
          className="bg-transparent text-[#f6ff5f] px-6 max-w-[100px] ml-4"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
        />
        <Dialog>
          <DialogTrigger disabled={disabled} asChild>
            <div className="bg-[#2d2d2d] min-h-14 rounded-full items-center p-2 flex h-full">
              <div className="flex gap-2 ">
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

                <input
                  readOnly
                  className="bg-transparent max-w-[150px] truncate"
                  value={currencyInfo ? currencyInfo?.name?.ru : "Наличные руб"}
                />
              </div>
              <ChevronDown width={28} height={28} />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-[#2d2d2d] border-none  shadow-black shadow-2xl rounded-2xl  grid  ">
            <div className="grid grid-cols-2 items-center">
              <DialogTitle className=" uppercase text-xl">Выбор валюты</DialogTitle>
              <div className="relative">
                <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
                <Input
                  className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-[#bbbbbb] placeholder:font-bold border-[#bbbbbb]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Поиск валюты"
                />
              </div>
            </div>
            <ScrollArea className="h-full ">
              <Tabs defaultValue={"Все"} className="min-h-[480px] max-h-[480px] min-w-[500px]">
                <TabsList className=" bg-[#2d2d2d] h-10  grid grid-flow-col gap-6 justify-start">
                  {filteredTabList.map((tab) => (
                    <TabsTrigger
                      className="data-[state=active]:bg-[#f6ff5f] uppercase rounded-full text-sm border-[#bbbbbb] border"
                      key={tab.id}
                      value={tab.name.ru}
                    >
                      {tab.name.ru}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {filteredTabList.map((tab) => (
                  <TabsContent className="grid grid-rows-1 gap-2" value={tab.name.ru} key={tab.id}>
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
