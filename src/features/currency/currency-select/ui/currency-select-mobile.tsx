"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse, SpecificValute } from "@/entities/currency";
import { HeaderArrow } from "@/shared/assets";
import { ExchangerMarker } from "@/shared/types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
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

export const CurrencySelectMobile = (props: CurrencySelectProps) => {
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
  const [activeTab, setActiveTab] = useState<string>("Все");

  const filteredTabList = filterTabList({
    tabList: currencies,
    searchValue: searchDeferredValue,
  });

  return (
    <Drawer>
      <DrawerTrigger
        className="disabled:opacity-50 w-full flex justify-between items-center"
        disabled={disabled}
      >
        <div className="flex flex-col  items-start">
          <p className="uppercase text-xs font-medium truncate">{label}</p>
          <p className="text-xs">{currencyInfo?.code_name}</p>
        </div>
        {currencyInfo && (
          <Image
            className="rounded-full "
            alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
            src={currencyInfo?.icon_url}
            width={36}
            height={36}
          />
        )}
      </DrawerTrigger>
      <DrawerContent className="h-svh flex flex-col p-4 rounded-none bg-dark-gray border-0">
        <DrawerHeader className="text-start text-lg p-0 grid gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-left font-medium text-base uppercase text-[#f6ff5f]">{label}</h2>
            <DrawerClose>
              <HeaderArrow className="size-5" />
            </DrawerClose>
          </div>
          <div className="relative">
            <SearchIcon
              color="#bbbbbb"
              className="absolute  left-2 translate-y-[6px] size-[30px]"
            />
            <Input
              placeholder={"ПОИСК ВАЛЮТЫ"}
              className="  rounded-3xl font-medium pl-12 bg-dark-gray border placeholder:text-base border-light-gray placeholder:text-light-gray placeholder:transition-opacity text-light-gray uppercase focus:placeholder:opacity-0"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </DrawerHeader>
        {filteredTabList && filteredTabList?.length > 0 ? (
          <Tabs
            defaultValue="ВСЕ"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col flex-grow overflow-hidden"
          >
            <TabsList className="flex items-center justify-start flex-wrap h-auto gap-3 bg-dark-gray">
              {filteredTabList.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  className="rounded-lg w-fit uppercase data-[state=active]:text-black data-[state=active]:border-yellow-main text-white data-[state=active]:bg-yellow-main "
                  value={tab?.name?.ru}
                >
                  <p className="truncate select-none lg:text-sm text-xs font-normal">
                    {tab?.name?.ru}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="flex-grow ">
              {filteredTabList.map((tab) => (
                <TabsContent
                  className="flex flex-col mt-0 gap-2 px-4"
                  value={tab?.name?.ru}
                  key={tab?.id}
                >
                  {tab.currencies.map((currency) => (
                    <DrawerClose key={currency?.id}>
                      <CurrencyCard
                        onClick={() => onClick(currency)}
                        key={currency?.id}
                        currency={currency}
                      />
                    </DrawerClose>
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
