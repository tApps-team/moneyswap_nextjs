"use client";
import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Currency, CurrencyCard, CurrencyResponse } from "@/entities/currency";
import { HeaderArrow } from "@/shared/assets";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { ExchangerMarker } from "@/shared/types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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

  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  if (isDesktop) {
    return (
      <div
        className={cx(
          "grid grid-flow-row mobile-xl:gap-3 gap-2 cursor-pointer w-full",
          disabled && "pointer-events-none ",
        )}
      >
        {label && (
          <label htmlFor="" className="uppercase mobile-xl:text-sm text-xs font-medium">
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
            value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
            onChange={(e) => setAmount?.(e.target.valueAsNumber)}
            className="focus-visible:outline-none bg-transparent text-yellow-main px-6 font-semibold mobile-xl:text-sm text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
          />
          <Dialog>
            <DialogTrigger className="disabled:opacity-50" disabled={disabled} asChild>
              <div className="bg-dark-gray min-h-14 justify-between select-none rounded-full border-l-2 border-light-gray items-center p-2 flex h-full">
                <div className="grid grid-cols-[0.2fr,1fr,0.2fr] items-center gap-2 truncate">
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
                    <div className="flex truncate mobile-xl:text-base text-xs flex-col">
                      <p className="uppercase truncate font-bold">{currencyInfo?.name.ru}</p>
                      <span className="font-medium">{currencyInfo?.code_name}</span>
                    </div>
                  ) : (
                    <p>Выберите валюту</p>
                  )}
                </div>
                <ChevronDown width={28} height={28} />
              </div>
            </DialogTrigger>
            <DialogContent className="bg-dark-gray border-none md:w-[80svw] lg:w-[60svw] xl:w-[50svw] 2xl:w-[40svw] grid gap-8 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
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

              <Tabs
                defaultValue={"Все"}
                value={activeTab}
                onValueChange={setActiveTab}
                className="overflow-hidden"
              >
                <TabsList className="w-full  bg-dark-gray">
                  <Carousel
                    ref={carouselRef}
                    opts={{
                      dragFree: true,
                    }}
                    setApi={setApi}
                    className="w-[80%]"
                  >
                    <CarouselPrevious className="border-none -translate-y-4 -translate-x-10 bg-none rounded-sm size-10" />
                    <CarouselContent className="gap-4 ml-0   py-2">
                      {filteredTabList.map((tab) => (
                        <TabsTrigger className="" value={tab?.name?.ru} key={tab.id} asChild>
                          <CarouselItem className="basis-1/3  rounded-2xl w-full uppercase data-[state=active]:text-black data-[state=active]:border-yellow-main text-white  h-10 data-[state=active]:bg-yellow-main shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]">
                            <p className="truncate">{tab.name.ru}</p>
                          </CarouselItem>
                        </TabsTrigger>
                      ))}
                    </CarouselContent>
                    <CarouselNext className="border-none -translate-y-4 translate-x-10 bg-none rounded-sm size-10" />
                  </Carousel>
                </TabsList>
                {/* <Carousel className="w-full">
                  <TabsList className="bg-white w-full  ">
                    <CarouselContent>
                      {filteredTabList.map((tab) => (
                        <CarouselItem key={tab?.id} className="basis-10/12 w-full">
                          <TabsTrigger
                            className="data-[state=active]:bg-yellow-main flex px-0 py-0  data-[state=active]:border-yellow-main text-light-gray uppercase rounded-full text-sm border-light-gray border"
                            value={tab?.name?.ru}
                          >
                            {tab?.name?.ru}
                          </TabsTrigger>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </TabsList>
                </Carousel> */}

                <ScrollArea className="h-[28rem] p-4">
                  {filteredTabList.map((tab) => (
                    <TabsContent className="" value={tab?.name?.ru} key={tab?.id}>
                      <div className="grid  p-2 gap-4">
                        {tab.currencies.map((currency) => (
                          <DialogClose key={currency?.id}>
                            <CurrencyCard
                              onClick={() => onClick(currency)}
                              key={currency?.id}
                              currency={currency}
                            />
                          </DialogClose>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </ScrollArea>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cx(
        "grid grid-flow-row mobile-xl:gap-3 gap-2 cursor-pointer w-full",
        disabled && "pointer-events-none ",
      )}
    >
      {label && (
        <label htmlFor="" className="uppercase mobile-xl:text-sm text-xs font-medium">
          {label}
        </label>
      )}
      <div
        className={cx(
          "grid  mobile-xl:grid-cols-2 mobile:grid-cols-[10rem,1fr] mobile-xs:grid-cols-[6rem,1fr] grid-cols-[4rem,1fr] h-16 justify-between mobile-xl:items-center border-2 border-light-gray rounded-full bg-gradient-to-l from-light-gray from-15% via-dark-gray via-80% to-dark-gray",
        )}
      >
        <input
          // disabled={true}
          readOnly
          value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
          onChange={(e) => setAmount?.(e.target.valueAsNumber)}
          className="text-base focus-visible:outline-none bg-transparent text-yellow-main mobile-xl:px-6 mobile:px-5 px-4 font-semibold mobile-xl:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
        />
        <Drawer>
          <DrawerTrigger className="disabled:opacity-50" disabled={disabled} asChild>
            <div className="bg-dark-gray min-h-14 justify-between select-none rounded-full border-l-2 border-light-gray items-center p-2 flex h-full">
              <div className="grid grid-cols-[0.2fr,1fr,0.2fr] items-center gap-2 truncate">
                {currencyInfo ? (
                  <figure className="size-9 rounded-full overflow-hidden  ">
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
                  <div className="flex truncate mobile-xl:text-base text-xs flex-col">
                    <p className="uppercase truncate font-bold">{currencyInfo?.name.ru}</p>
                    <span className="font-medium">{currencyInfo?.code_name}</span>
                  </div>
                ) : (
                  <p>Выберите валюту</p>
                )}
              </div>
              <ChevronDown width={28} height={28} />
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-svh  p-4 rounded-none bg-dark-gray border-none">
            <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-left font-semibold text-base uppercase text-[#f6ff5f]">
                  {label}
                </h2>
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
            <div className="w-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className=" -mx-4">
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
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
