"use client";

import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
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
  const { label, disabled, currencies, currencyInfo, isCollapsed, onClick } = props;

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
          className="disabled:opacity-50 gap-4  w-full flex flex-col justify-between items-start"
          disabled={disabled}
        >
          <Label className="font-bold uppercase text-yellow-main">{label}</Label>
          <div className="flex items-center gap-3">
            {currencyInfo && (
              <Image
                className="rounded-full "
                alt={`${currencyInfo?.name?.ru} (${currencyInfo?.code_name})`}
                src={currencyInfo?.icon_url}
                width={36}
                height={36}
              />
            )}
            <div className="flex flex-col min-w-0  truncate items-start">
              <p className="text-font-light-grey text-xs truncate md:text-base w-full  font-semibold  uppercase">
                {currencyInfo?.name.ru}
              </p>
              <p className="text-font-dark-grey text-xs md:text-base font-bold">
                {currencyInfo?.code_name}
              </p>
            </div>
            <ChevronDown />
          </div>
        </DrawerTrigger>
      ) : (
        <DrawerTrigger
          className="disabled:opacity-50      w-full bg-[#191C25] lg:bg-transparent hover:bg-new-light-grey"
          disabled={disabled}
          asChild
        >
          <div className=" min-h-12 h-14   justify-between select-none rounded-[6px]  cursor-pointer  items-center p-2 flex ">
            <div className="flex  truncate items-center gap-4">
              {currencyInfo ? (
                <figure className="w-[36px] h-[36px] rounded-full overflow-hidden flex-shrink-0">
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
                <div className="flex  min-w-0  mobile-xl:text-base text-xs flex-col">
                  <p className="uppercase  truncate   font-semibold text-font-light-grey">
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
        </DrawerTrigger>
      )}

      <DrawerContent className="h-svh flex flex-col gap-4 p-4 rounded-none bg-new-dark-grey border-0">
        <DrawerHeader className="text-start text-lg p-0 grid gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-left font-medium text-base uppercase text-[#f6ff5f]">{label}</h2>
            <DrawerClose>
              <HeaderArrow className="size-5" />
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
              className="rounded-[10px]  pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal  placeholder:transition-opacity focus:placeholder:opacity-0"
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
            className="flex flex-col gap-4 flex-grow overflow-hidden"
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
      </DrawerContent>
    </Drawer>
  );
};
