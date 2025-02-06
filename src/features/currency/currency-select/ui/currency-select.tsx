"use client";

import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useId, useState } from "react";
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
  const id = useId();
  const filteredTabList = filterTabList({
    tabList: currencies,
    searchValue: searchDeferredValue,
  });

  return (
    <div
      className={cx(
        "flex flex-col bg-new-grey rounded-[15px] py-6 px-12 gap-5",
        disabled && "pointer-events-none ",
      )}
    >
      <label
        htmlFor={label}
        className="uppercase mobile-xl:text-[20px] text-xs text-font-light-grey font-bold"
      >
        {label}
      </label>

      <input
        disabled={true}
        id={label}
        value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
        onChange={(e) => setAmount?.(e.target.valueAsNumber)}
        className="bg-[#43464E] font-semibold w-full focus-visible:outline-none  py-5 pl-8 rounded-xl text-yellow-main px-6  mobile-xl:text-sm text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:transition-opacity focus:placeholder:opacity-0"
      />
      <Dialog>
        <DialogTrigger
          className="disabled:opacity-50 hover:bg-new-light-grey"
          disabled={disabled}
          asChild
        >
          <div className=" min-h-14 justify-between select-none rounded-[6px]  cursor-pointer  items-center p-2 flex h-full">
            <div className="flex items-center gap-4">
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
                  <p className="uppercase truncate font-semibold text-font-light-grey">
                    {currencyInfo?.name?.ru}
                  </p>
                  <span className="font-bold text-font-dark-grey truncate">
                    {currencyInfo?.code_name}
                  </span>
                </div>
              ) : (
                <p>Выберите валюту</p>
              )}
            </div>
            <div className="w-7 h-7">
              <ChevronDown width={20} color="#B9B9B9" height={20} />
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
                  <TabsContent className="flex flex-col mt-0 " value={tab?.name?.ru} key={tab?.id}>
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
  );
};
