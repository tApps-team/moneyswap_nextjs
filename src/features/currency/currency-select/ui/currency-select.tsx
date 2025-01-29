"use client";

import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import {
  CurrencyCard,
  type SpecificValute,
  type Currency,
  type CurrencyResponse,
} from "@/entities/currency";
import type { ExchangerMarker } from "@/shared/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { EmptyList } from "@/shared/ui/empty-list";
import { filterTabList } from "../model/filter-tab";

type CurrencySelectProps = {
  label?: string;
  disabled?: boolean;
  currencies?: CurrencyResponse[];
  currencyInfo?: SpecificValute | null;
  direction?: ExchangerMarker;
  onClick: (currency: Currency) => void;
  amount?: number | null;
  setAmount?: (amount: number) => void;
  actualCourse: number | null;
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { label, disabled, currencies, currencyInfo, onClick, setAmount, actualCourse } = props;

  const [searchValue, setSearchValue] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Все");
  const searchDeferredValue = useDeferredValue(searchValue);

  const filteredTabList = filterTabList({
    tabList: currencies,
    searchValue: searchDeferredValue,
  });

  return (
    <div
      className={cx(
        "grid grid-flow-row mobile-xl:gap-3 gap-2 cursor-pointer w-full",
        disabled && "pointer-events-none ",
      )}
    >
      {label && (
        <label htmlFor={label} className="uppercase mobile-xl:text-sm text-xs font-normal">
          {label}
        </label>
      )}
      <div
        className={cx(
          "grid lg:grid-cols-[7rem,1fr] xl:grid-cols-2 grid-cols-2 h-16 justify-between items-center border-2 border-light-gray rounded-full bg-gradient-to-l from-light-gray from-15% via-dark-gray via-80% to-dark-gray",
        )}
      >
        <input
          disabled={true}
          id={label}
          value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
          onChange={(e) => setAmount?.(e.target.valueAsNumber)}
          className="focus-visible:outline-none bg-transparent text-yellow-main px-6 font-normal mobile-xl:text-sm text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:transition-opacity focus:placeholder:opacity-0"
        />
        <Dialog>
          <DialogTrigger className="disabled:opacity-50" disabled={disabled} asChild>
            <div className="bg-dark-gray min-h-14 justify-between select-none rounded-full border-l-2 border-light-gray items-center p-2 flex h-full">
              <div className="grid grid-cols-[36px,1fr] items-center gap-2 truncate">
                {currencyInfo ? (
                  <figure className="w-[36px] rounded-full overflow-hidden h-[36px]">
                    <Image
                      className="rounded-full overflow-hidden"
                      alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                      src={currencyInfo?.icon_url || "/placeholder.svg"}
                      width={36}
                      height={36}
                    />
                  </figure>
                ) : (
                  <CircleSlash2 width={36} height={36} stroke="#bbb" strokeWidth={"1.5px"} />
                )}

                {currencyInfo ? (
                  <div className="flex truncate mobile-xl:text-base text-xs flex-col">
                    <p className="uppercase truncate font-normal">{currencyInfo?.name?.ru}</p>
                    <span className="font-light truncate">{currencyInfo?.code_name}</span>
                  </div>
                ) : (
                  <p>Выберите валюту</p>
                )}
              </div>
              <div className="w-7 h-7">
                <ChevronDown width={28} height={28} />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-new-dark-grey border-none md:w-[80vw] h-[60vh] lg:w-[60vw] xl:w-[50vw] max-w-[700px] flex flex-col gap-4 rounded-[35px]  overflow-hidden">
            <DialogHeader className="grid grid-cols-2 grid-rows-1 items-center">
              <DialogTitle className="uppercase text-xl font-normal text-yellow-main">
                Выбор валюты
              </DialogTitle>
              <div className="relative">
                <SearchIcon
                  width={22}
                  height={22}
                  className="absolute translate-y-2 left-3"
                  color="#bbbbbb"
                />
                <Input
                  className="rounded-[10px]  pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal  placeholder:transition-opacity focus:placeholder:opacity-0"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Поиск валюты"
                  color="#BBBBBB"
                />
              </div>
            </DialogHeader>
            {filteredTabList && filteredTabList?.length > 0 ? (
              <Tabs
                defaultValue={"Все"}
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col flex-grow overflow-hidden"
              >
                <TabsList className="flex items-center justify-start flex-wrap h-auto gap-4 bg-transparent">
                  {filteredTabList.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      className="rounded-[9px] w-fit bg-new-light-grey  data-[state=active]:text-black data-[state=active]:border-yellow-main text-white data-[state=active]:bg-yellow-main "
                      value={tab?.name?.ru}
                    >
                      <p className="truncate select-none lg:text-sm text-xs font-normal">
                        {tab?.name?.ru}
                      </p>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <ScrollArea className="flex-grow">
                  {filteredTabList.map((tab) => (
                    <TabsContent
                      className="flex flex-col mt-0 "
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
                </ScrollArea>
              </Tabs>
            ) : (
              <EmptyList />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
