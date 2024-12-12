"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse } from "@/entities/currency";
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
  currencyInfo?: Currency | null;
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
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);

  const searchDeferredValue = useDeferredValue(searchValue);
  const [activeTab, setActiveTab] = useState<string>("Все");
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

  const filteredTabList = filterTabList({
    tabList: tabList,
    searchValue: searchDeferredValue,
  });
  const scrollToActiveTab = useCallback(() => {
    if (api) {
      console.log(filteredTabList);
      const scrollIndex = filteredTabList.findIndex((tab) => tab.name.ru === activeTab);
      console.log(scrollIndex);
      api?.scrollTo(scrollIndex);
    }
  }, [activeTab, api, filteredTabList]);
  useEffect(() => {
    if (api) {
      scrollToActiveTab();
    }
  }, [api, scrollToActiveTab]);

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
      <DrawerContent className="h-svh  p-4 rounded-none bg-dark-gray border-0">
        <DrawerHeader className="text-start text-lg p-0 grid gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-left font-semibold text-base uppercase text-[#f6ff5f]">{label}</h2>
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
        {filteredTabList?.length > 0 ? (
          <div className="w-full">
            <Tabs
              defaultValue="ВСЕ"
              value={activeTab}
              onValueChange={setActiveTab}
              className=" -mx-4"
            >
              <TabsList data-vaul-no-drag className="bg-dark-gray   w-full  h-full">
                <Carousel
                  ref={carouselRef}
                  opts={{
                    dragFree: true,
                  }}
                  setApi={setApi}
                  className="w-full "
                >
                  <CarouselContent className="m-0 w-full  gap-3 py-3">
                    {filteredTabList?.map((filteredCategory) => (
                      <CarouselItem key={filteredCategory.id} className="w-full pl-0 basis-2/5">
                        <TabsTrigger
                          className={
                            "rounded-2xl w-full uppercase data-[state=active]:text-black data-[state=active]:border-yellow-main text-white  h-10 data-[state=active]:bg-yellow-main shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                          }
                          value={filteredCategory.name.ru}
                        >
                          <p className="truncate leading-0 font-medium">
                            {filteredCategory.name.ru}
                          </p>
                        </TabsTrigger>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </TabsList>

              <ScrollArea className="h-[calc(80svh-3rem)] mx-4 ">
                <div className="py-3">
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
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        ) : (
          <EmptyList />
        )}
      </DrawerContent>
    </Drawer>
  );
};
