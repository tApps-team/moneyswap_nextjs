"use client";

import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse, SpecificValute } from "@/entities/currency";
import { HeaderArrow } from "@/shared/assets";
import { ExchangerMarker } from "@/shared/types";
import {
  DialogClose,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Input,
  Label,
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
  isCollapsed: boolean;
};

export const CurrencySelectMobile = (props: CurrencySelectProps) => {
  const {
    label,
    disabled,
    currencies,
    currencyInfo,
    isCollapsed,
    onClick,
    setAmount,
    actualCourse,
  } = props;

  const [searchValue, setSearchValue] = useState<string>("");

  const searchDeferredValue = useDeferredValue(searchValue);
  const [activeTab, setActiveTab] = useState<string>("Все");

  const filteredTabList = filterTabList({
    tabList: currencies,
    searchValue: searchDeferredValue,
  });

  return (
    <Drawer>
      {isCollapsed ? (
        <DrawerTrigger
          className="disabled:opacity-50 gap-2 w-full flex flex-col justify-between items-start"
          disabled={disabled}
        >
          <Label className="font-bold uppercase text-yellow-main leading-none mobile:text-base text-sm">
            {label}
          </Label>
          <div className="grid grid-flow-col justify-start justify-items-start items-stretch content-between gap-2">
            {currencyInfo && (
              <Image
                className="rounded-full overflow-hidden size-7 self-center"
                alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                src={currencyInfo?.icon_url}
                width={27}
                height={27}
              />
            )}
            <div className="text-start h-full grid grid-flow-row justify-start justify-items-start items-stretch content-between min-w-0">
              <p className="leading-none mobile-xl:w-[32vw] mobile:w-[29vw] w-[24vw] text-font-light-grey text-xs truncate md:text-base font-semibold uppercase">
                {currencyInfo?.name?.ru}
              </p>
              <p className="leading-none mobile-xs:max-w-[29vw] max-w-[26vw] text-font-dark-grey text-xs truncate md:text-base font-bold">
                {currencyInfo?.code_name}
              </p>
            </div>
            <div className="w-5 h-5 self-center">
              <ChevronDown width={20} color="#B9B9B9" height={20} />
            </div>
          </div>
        </DrawerTrigger>
      ) : (
        <div className="grid grid-flow-row justify-stretch justify-items-stretch w-full gap-4">
          <label
            htmlFor={label}
            className="pl-5 uppercase text-yellow-main font-bold leading-none mobile:text-base text-sm"
          >
            {label}
          </label>
          <div className="relative">
            <input
              disabled={true}
              id={label}
              value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
              onChange={(e) => setAmount?.(e.target.valueAsNumber)}
              className="disabled:opacity-100 mobile-xl:pr-[42vw] mobile:pr-[45vw] pr-[55vw] w-full truncate bg-[#43464E] font-semibold mobile-xl:h-[65px] h-[60px] focus-visible:outline-none py-5 mobile:pl-8 pl-5 rounded-xl text-yellow-main px-6 md:text-lg text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:transition-opacity focus:placeholder:opacity-0"
            />
            <DrawerTrigger
              className="absolute right-2 top-[6px] lg:h-full mobile-xl:h-[calc(65px_-_12px)] h-[calc(60px_-_12px)] lg:right-0 lg:top-0 mobile-xl:w-[40vw] mobile:w-[42vw] w-[50vw] lg:w-full lg:relative bg-[#191C25] lg:bg-transparent hover:bg-new-light-grey lg:p-3 p-2 px-3"
              disabled={disabled}
              asChild
            >
              <div className="min-h-12 h-14 justify-between select-none rounded-[6px] cursor-pointer items-center p-2 flex ">
                <div className="grid grid-flow-col justify-start justify-items-start truncate gap-3">
                  {currencyInfo ? (
                    <figure className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        className="rounded-full overflow-hidden"
                        alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                        src={currencyInfo?.icon_url || "/placeholder.svg"}
                        width={36}
                        height={36}
                      />
                    </figure>
                  ) : (
                    <CircleSlash2 width={27} height={27} stroke="#bbb" strokeWidth={"1.5px"} />
                  )}

                  {currencyInfo ? (
                    <div className="h-full grid grid-flow-row justify-start justify-items-start items-stretch content-between min-w-0 text-xs">
                      <p className="leading-none uppercase truncate font-semibold text-font-light-grey mobile-xl:w-[calc(40vw_-_84px)] mobile:w-[calc(42vw_-_84px)] w-[calc(50vw_-_84px)]">
                        {currencyInfo?.name?.ru}
                      </p>
                      <span className="leading-none uppercase truncate font-bold text-font-dark-grey mobile-xl:w-[calc(40vw_-_84px)] mobile:w-[calc(42vw_-_84px)] w-[calc(50vw_-_84px)]">
                        {currencyInfo?.code_name}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs">Выберите валюту</p>
                  )}
                </div>
                <div className="w-5 h-5">
                  <ChevronDown width={20} color="#B9B9B9" height={20} />
                </div>
              </div>
            </DrawerTrigger>
          </div>
        </div>
      )}

      <DrawerContent className="h-dvh flex flex-col gap-4 p-4 pb-0 rounded-none bg-new-dark-grey border-0">
        <DrawerHeader className="text-start text-lg p-0 grid gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-left font-bold text-base uppercase text-[#f6ff5f]">{label}</h2>
            <DrawerClose>
              <HeaderArrow className="size-4 -rotate-45" />
            </DrawerClose>
          </div>
          <div className="relative">
            <SearchIcon
              width={22}
              height={22}
              className="absolute translate-y-2 left-3"
              color="#bbbbbb"
            />
            <Input
              className="text-base rounded-[10px] pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal placeholder:transition-opacity focus:placeholder:opacity-0 leading-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Поиск валюты"
              color="#BBBBBB"
            />
          </div>
        </DrawerHeader>
        {filteredTabList && filteredTabList?.length > 0 ? (
          <Tabs
            defaultValue={"Все"}
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col gap-2 flex-grow overflow-hidden"
          >
            <TabsList className="flex items-center justify-start flex-wrap h-auto gap-2 bg-transparent">
              {filteredTabList.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  className="rounded-[7px] w-fit bg-new-light-grey  data-[state=active]:text-black data-[state=active]:border-yellow-main text-white data-[state=active]:bg-yellow-main "
                  value={tab?.name?.ru}
                >
                  <p className="truncate select-none lg:text-sm text-xs font-bold">
                    {tab?.name?.ru}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="flex-grow">
              {filteredTabList.map((tab) => (
                <TabsContent
                  className="flex flex-col mt-2 gap-4"
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
      </DrawerContent>
    </Drawer>
  );
};
