"use client";
import { cx } from "class-variance-authority";
import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
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
  const [activeTab, setActiveTab] = useState<string>("Все");

  const carouselRef = useRef<HTMLDivElement>(null);

  const searchDeferredValue = useDeferredValue(searchValue);

  const tabList: CurrencyResponse[] = useMemo(
    () => [
      {
        name: { en: "All", ru: "Все" },
        currencies: Array.isArray(currencies)
          ? currencies.map((currency) => currency?.currencies).flat()
          : [],
        id: "All",
      },

      ...(Array.isArray(currencies) ? currencies : []),
    ],
    [currencies],
  );

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
            <DialogContent className="bg-dark-gray border-none md:w-[80vw] h-[60vh] lg:w-[60vw] xl:w-[50vw] max-w-[700px] flex-col gap-4 flex rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
              <DialogDescription className="sr-only"></DialogDescription>
              <div className="grid grid-cols-2 grid-rows-1 items-center">
                <DialogTitle className="uppercase text-xl font-normal">Выбор валюты</DialogTitle>
                <div className="relative">
                  <SearchIcon
                    width={22}
                    height={22}
                    className="absolute translate-y-2 left-3"
                    color="#bbbbbb"
                  />
                  <Input
                    className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-light-gray placeholder:font-normal border-light-gray placeholder:transition-opacity focus:placeholder:opacity-0"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Поиск валюты"
                    color="#BBBBBB"
                  />
                </div>
              </div>
              {filteredTabList.length > 0 ? (
                <Tabs
                  defaultValue={"Все"}
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className=""
                >
                  <TabsList className="w-full px-4 bg-dark-gray">
                    <Carousel
                      ref={carouselRef}
                      opts={{
                        dragFree: true,
                      }}
                      setApi={setApi}
                      className="w-full"
                    >
                      <CarouselContent className="gap-2 m-0 py-2">
                        {filteredTabList?.map((tab) => (
                          <CarouselItem key={tab.id} className="basis-2/7 p-1">
                            <TabsTrigger
                              className="rounded-2xl w-full uppercase data-[state=active]:text-black data-[state=active]:border-yellow-main text-white lg:h-10 h-9 data-[state=active]:bg-yellow-main shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                              value={tab?.name?.ru}
                            >
                              <p className="truncate select-none lg:text-sm text-xs font-normal">
                                {tab?.name?.ru}
                              </p>
                            </TabsTrigger>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="[&>svg]:stroke-white [&>svg]:hover:stroke-yellow-main border-none bg-transparent rounded-sm size-8 mt-0 lg:-left-10 -left-9 top-[50%] -translate-y-[50%] hover:bg-transparent" />
                      <CarouselNext className="[&>svg]:stroke-white [&>svg]:hover:stroke-yellow-main border-none bg-transparent rounded-sm size-8 mt-0 lg:-right-10 -right-9 top-[50%] -translate-y-[50%] hover:bg-transparent" />
                    </Carousel>
                  </TabsList>

                  <ScrollArea className="h-[calc(60vh_-_140px)] p-4">
                    {filteredTabList.map((tab) => (
                      <TabsContent className="" value={tab?.name?.ru} key={tab?.id}>
                        <div className="grid px-2 pb-3 gap-4">
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
              ) : (
                <EmptyList />
              )}
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
        <label htmlFor="" className="uppercase mobile-xl:text-sm text-xs font-normal">
          {label}
        </label>
      )}
      <div
        className={cx(
          "grid  mobile-xl:grid-cols-2 mobile:grid-cols-[10rem,1fr] mobile-xs:grid-cols-[6rem,1fr] grid-cols-[4rem,1fr] h-16 justify-between mobile-xl:items-center border-2 border-light-gray rounded-full bg-gradient-to-l from-light-gray from-15% via-dark-gray via-80% to-dark-gray",
        )}
      >
        <input
          readOnly
          value={typeof actualCourse === "number" && actualCourse ? actualCourse : "нет данных"}
          onChange={(e) => setAmount?.(e.target.valueAsNumber)}
          className="text-base focus-visible:outline-none bg-transparent text-yellow-main mobile-xl:px-6 mobile:px-5 px-4 font-normal mobile-xl:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:transition-opacity focus:placeholder:opacity-0"
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
                    <p className="uppercase truncate font-normal">{currencyInfo?.name.ru}</p>
                    <span className="font-light">{currencyInfo?.code_name}</span>
                  </div>
                ) : (
                  <p>Выберите валюту</p>
                )}
              </div>
              <ChevronDown width={28} height={28} />
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-dvh p-4 rounded-none bg-transparent border-0">
            <DrawerTitle className="sr-only"></DrawerTitle>
            <DrawerDescription className="sr-only"></DrawerDescription>
            <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-left font-normal text-base uppercase text-[#f6ff5f]">
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
                  className="rounded-3xl pl-12 bg-dark-gray border text-base placeholder:text-base border-light-gray placeholder:text-light-gray placeholder:transition-opacity text-light-gray uppercase focus:placeholder:opacity-0"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  color="#BBBBBB"
                />
              </div>
            </DrawerHeader>
            {filteredTabList?.length > 0 ? (
              <div className="w-full">
                <Tabs
                  defaultValue="ВСЕ"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className=""
                >
                  <TabsList data-vaul-no-drag className="bg-transparent w-full h-full">
                    <Carousel
                      ref={carouselRef}
                      opts={{
                        dragFree: true,
                      }}
                      setApi={setApi}
                      className="w-full [&>div]:overflow-visible"
                    >
                      <CarouselContent className="m-0 w-full gap-3 py-3">
                        {filteredTabList?.map((filteredCategory) => (
                          <CarouselItem key={filteredCategory.id} className="w-full pl-0 basis-2/5">
                            <TabsTrigger
                              className={
                                "bg-dark-gray rounded-2xl w-full uppercase data-[state=active]:text-black data-[state=active]:border-yellow-main text-white h-10 data-[state=active]:bg-yellow-main shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                              }
                              value={filteredCategory.name.ru}
                            >
                              <p className="truncate leading-0 font-normal">
                                {filteredCategory.name.ru}
                              </p>
                            </TabsTrigger>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </TabsList>

                  <ScrollArea className="h-[calc(100dvh_-200px)] -mx-2">
                    <div className="py-2">
                      {filteredTabList.map((tab) => (
                        <TabsContent
                          className="flex flex-col mt-0 gap-3 px-4"
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
      </div>
    </div>
  );
};
