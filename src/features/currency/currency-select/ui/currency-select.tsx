import { cx } from "class-variance-authority";
import { Bitcoin, ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
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
  direction?: directions;
  onClick: (currency: Currency) => void;
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { label, disabled, currencies, currencyInfo, direction, onClick } = props;
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
    <div
      className={cx(
        "grid grid-flow-row gap-3 cursor-pointer w-full",
        disabled && "pointer-events-none ",
      )}
    >
      {label && <p className="uppercase text-sm font-medium">{label}</p>}
      <div
        className={cx(
          "grid grid-cols-2 justify-between items-center border-2 border-[#bbbbbb] rounded-full bg-gradient-to-l from-[#fff] from-5% via-[#606060] via-40% to-[#2d2d2d]",
          // direction === directions.cash && "grid-cols-[minmax(10vw,_1fr)_3fr]",
        )}
      >
        <input
          disabled={disabled}
          type="number"
          className="bg-transparent text-[#f6ff5f] px-6 font-semibold text-sm"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
        />
        <Dialog>
          <DialogTrigger disabled={disabled} asChild>
            <div className="bg-[#2d2d2d] min-h-14 rounded-full border-l-2 border-[#bbb] items-center p-2 flex h-full">
              <div className="grid grid-flow-col gap-2 truncate">
                {currencyInfo ? (
                  <figure className="w-[36px] h-[36px]">
                    <Image
                      alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                      src={currencyInfo?.icon_url}
                      width={36}
                      height={36}
                    />
                  </figure>
                ) : (
                  <CircleSlash2 width={36} height={36} stroke="#bbb" strokeWidth={"1.5px"} />
                )}

                <input
                  readOnly
                  className="bg-transparent truncate uppercase"
                  value={currencyInfo ? currencyInfo?.name?.ru : "Не выбрано..."}
                />
              </div>
              <ChevronDown width={28} height={28} />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-[#2d2d2d] border-none grid rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-2 items-center">
              <DialogTitle className=" uppercase text-xl">Выбор валюты</DialogTitle>
              <div className="relative">
                <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
                <Input
                  className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-[#bbbbbb] placeholder:font-semibold border-[#bbbbbb]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Поиск валюты"
                />
              </div>
            </div>
            <ScrollArea className="h-full">
              <Tabs defaultValue={"Все"} className="min-h-[480px] max-h-[480px] min-w-[500px]">
                <TabsList className=" bg-[#2d2d2d] h-10 mb-7 grid grid-flow-col gap-6 justify-start">
                  {filteredTabList.map((tab) => (
                    <TabsTrigger
                      className="data-[state=active]:bg-[#f6ff5f] data-[state=active]:border-[#f6ff5f] text-[#bbb] uppercase rounded-full text-sm border-[#bbbbbb] border"
                      key={tab?.id}
                      value={tab?.name?.ru}
                    >
                      {tab?.name?.ru}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {filteredTabList.map((tab) => (
                  <TabsContent
                    className="grid grid-rows-1 gap-2"
                    value={tab?.name?.ru}
                    key={tab?.id}
                  >
                    {tab.currencies.map((currency) => (
                      <DialogClose key={currency?.id}>
                        <CurrencyCard
                          onClick={() => onClick(currency)}
                          key={currency?.id}
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
