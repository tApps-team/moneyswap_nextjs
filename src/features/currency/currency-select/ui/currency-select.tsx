"use client";

import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import {
  CurrencyCard,
  type Currency,
  type CurrencyResponse,
  type SpecificValute,
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
  currencyInfoGive?: SpecificValute | null;
  currencyInfoGet?: SpecificValute | null;
  direction?: ExchangerMarker;
  amount?: number | null;
  setAmount?: (amount: number) => void;
  actualCourse: number | null;
  type: "give" | "get";
  location_code_name?: string;
  onAmountChange?: (value: number, type: "give" | "get") => void;
};

export const CurrencySelect = (props: CurrencySelectProps) => {
  const {
    label,
    disabled,
    currencies,
    currencyInfoGive,
    currencyInfoGet,
    setAmount,
    actualCourse,
    type,
    direction,
    location_code_name,
    onAmountChange,
  } = props;

  const currencyInfo = type === "give" ? currencyInfoGive : currencyInfoGet;

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
        "lg:flex lg:flex-col grid grid-cols-2 grid-rows-1 lg:bg-new-grey rounded-[15px] lg:py-6 xl:px-12 lg:px-8 gap-5",
        disabled && "pointer-events-none",
      )}
    >
      <label
        htmlFor={label}
        className="uppercase col-span-full bg-transparent xl:text-xl lg:text-lg text-base lg:text-font-light-grey text-yellow-main font-bold"
      >
        {label}
      </label>
      <div className="relative col-span-full w-full flex gap-2 flex-row items-center lg:flex-col">
        <Dialog>
          <DialogTrigger
            className="disabled:opacity-50 absolute right-2 top-[6px] lg:h-full h-[calc(65px_-_12px)] lg:right-0 lg:top-0 w-[40vw] lg:w-full lg:relative bg-[#191C25] lg:bg-transparent hover:bg-new-light-grey lg:p-3 p-2 px-3"
            disabled={disabled}
            asChild
          >
            <div className="justify-between select-none rounded-[9px] cursor-pointer items-center p-2 flex lg:h-full">
              <div className="grid grid-flow-col gap-4">
                {currencyInfo ? (
                  <figure className="lg:w-[40px] lg:h-[40px] w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      className="rounded-full overflow-hidden"
                      alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                      src={currencyInfo?.icon_url || "/placeholder.svg"}
                      width={40}
                      height={40}
                    />
                  </figure>
                ) : (
                  <CircleSlash2 width={42} height={42} stroke="#bbb" strokeWidth={"1.5px"} />
                )}

                {currencyInfo ? (
                  <div className="grid grid-flow-row justify-start items-stretch h-full min-w-0 lg:text-lg md:text-base text-xs uppercase">
                    <p className="leading-none truncate font-semibold text-font-light-grey">
                      {currencyInfo?.name?.ru}
                    </p>
                    <span className="leading-none font-bold text-font-dark-grey truncate mt-auto">
                      {currencyInfo?.code_name}
                    </span>
                  </div>
                ) : (
                  <p>Выберите валюту</p>
                )}
              </div>
              <div className="w-5 h-5">
                <ChevronDown width={20} color="#B9B9B9" height={20} />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="lg:px-7 lg:pb-5 lg:pt-[30px] shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] rounded-[20px] bg-new-dark-grey border-none md:w-[80vw] h-[70dvh] lg:w-[60vw] xl:w-[50vw] max-w-[600px] flex flex-col gap-[30px]">
            <DialogHeader className="grid grid-cols-1 grid-rows-1 items-center">
              <DialogTitle className="h-full grid grid-cols-2 justify-between items-center leading-none uppercase text-[22px] font-bold text-yellow-main">
                Выбор валюты
                <div className="relative">
                  <SearchIcon
                    width={22}
                    height={22}
                    className="absolute translate-y-2 left-3"
                    color="#bbbbbb"
                  />
                  <Input
                    className="rounded-[10px] pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal placeholder:transition-opacity focus:placeholder:opacity-0"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Поиск валюты"
                    color="#BBBBBB"
                  />
                </div>
              </DialogTitle>
            </DialogHeader>
            {filteredTabList && filteredTabList?.length > 0 ? (
              <Tabs
                defaultValue={"Все"}
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col flex-grow overflow-hidden gap-[20px]"
              >
                <TabsList className="p-0 flex items-center justify-start flex-wrap h-auto gap-4 bg-transparent">
                  {filteredTabList.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      className="rounded-[7px] w-fit bg-new-light-grey data-[state=active]:text-black data-[state=active]:border-yellow-main text-white data-[state=active]:bg-yellow-main py-[10px] px-[18px]"
                      value={tab?.name?.ru}
                    >
                      <p className="truncate select-none lg:text-sm text-xs font-medium leading-none">
                        {tab?.name?.ru}
                      </p>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <ScrollArea className="flex-grow">
                  {filteredTabList.map((tab) => (
                    <TabsContent
                      className="flex flex-col gap-2 mt-0"
                      value={tab?.name?.ru}
                      key={tab?.id}
                    >
                      {tab?.currencies.map((currency, index) => (
                        <DialogClose key={currency?.id}>
                          <CurrencyCard
                            key={currency?.id}
                            currency={currency}
                            type={type}
                            currencyInfo={type === "get" ? currencyInfoGive : currencyInfoGet}
                            direction={direction}
                            location_code_name={location_code_name}
                            index={index}
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
        <input
          disabled={disabled}
          id={label}
          type="number"
          value={typeof actualCourse === "number" && actualCourse ? actualCourse : ""}
          onChange={(e) => {
            const value = e.target.valueAsNumber || 0;
            onAmountChange?.(value, type);
          }}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          className="bg-[#43464E] font-semibold h-[65px] w-full focus-visible:outline-none py-5 pl-8 rounded-xl px-6 md:text-lg mobile-xl:text-sm text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:transition-opacity focus:placeholder:opacity-0"
          placeholder="Введите сумму"
        />
      </div>
    </div>
  );
};
