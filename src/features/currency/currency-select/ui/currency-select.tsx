import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse } from "@/entities/currency";
import { ExchangerMarker, directions } from "@/shared/types";
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
  direction?: ExchangerMarker;
  onClick: (currency: Currency) => void;
  amount?: number | null;
  setAmount?: (amount: number) => void;
  actualCourse: number | null;
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const {
    label,
    disabled,
    currencies,
    currencyInfo,
    direction,
    onClick,
    amount,
    setAmount,
    actualCourse,
  } = props;
  const [searchValue, setSearchValue] = useState<string>("");

  const searchDeferredValue = useDeferredValue(searchValue);

  const tabList: CurrencyResponse[] = [
    {
      name: { en: "All", ru: "Все" },
      currencies: Array.isArray(currencies)
        ? currencies.map((currency) => currency?.currencies).flat()
        : [],
      id: "All",
    },
    ...(Array.isArray(currencies) ? currencies : []),
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
          "grid grid-cols-2 h-16 justify-between items-center border-2 border-light-gray rounded-full bg-gradient-to-l from-light-gray from-15% via-dark-gray via-80% to-dark-gray",
        )}
      >
        <input
          disabled={true}
          value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
          onChange={(e) => setAmount?.(e.target.valueAsNumber)}
          className="focus-visible:outline-none bg-transparent text-yellow-main px-6 font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
        />
        <Dialog>
          <DialogTrigger className="disabled:opacity-50" disabled={disabled} asChild>
            <div className="bg-dark-gray min-h-14 justify-between select-none rounded-full border-l-2 border-light-gray items-center p-2 flex h-full">
              <div className="grid grid-flow-col items-center gap-2 truncate">
                {currencyInfo ? (
                  <figure className="w-[36px] rounded-full overflow-hidden  h-[36px]">
                    <Image
                      className="rounded-full overflow-hidden"
                      alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                      src={currencyInfo?.icon_url}
                      width={36}
                      height={36}
                    />
                  </figure>
                ) : (
                  <CircleSlash2 width={36} height={36} stroke="#bbb" strokeWidth={"1.5px"} />
                )}

                {currencyInfo ? (
                  <div className="flex truncate flex-col">
                    <p className="uppercase font-bold">{currencyInfo?.name.ru}</p>
                    <span className="font-medium">{currencyInfo?.code_name}</span>
                  </div>
                ) : (
                  <p>Выберите валюту</p>
                )}
              </div>
              <ChevronDown width={28} height={28} />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-dark-gray border-none  grid gap-8 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-2 grid-rows-1 items-center">
              <DialogTitle className="uppercase text-xl">Выбор валюты</DialogTitle>
              <div className="relative">
                <SearchIcon
                  width={22}
                  height={22}
                  className="absolute translate-y-2 left-3"
                  color="#bbbbbb"
                />
                <Input
                  className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-light-gray placeholder:font-semibold border-light-gray"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Поиск валюты"
                />
              </div>
            </div>

            <Tabs defaultValue={"Все"} className="">
              <TabsList className="bg-dark-gray grid grid-flow-col gap-6 justify-start">
                {filteredTabList.map((tab) => (
                  <TabsTrigger
                    className="data-[state=active]:bg-yellow-main data-[state=active]:border-yellow-main text-light-gray uppercase rounded-full text-sm border-light-gray border"
                    key={tab?.id}
                    value={tab?.name?.ru}
                  >
                    {tab?.name?.ru}
                  </TabsTrigger>
                ))}
              </TabsList>

              <ScrollArea className="h-[28rem] p-10">
                {filteredTabList.map((tab) => (
                  <TabsContent className="grid  gap-2" value={tab?.name?.ru} key={tab?.id}>
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
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
