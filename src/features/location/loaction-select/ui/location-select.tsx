"use client";
import { ChevronDown, ChevronRight, Circle, Loader, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  City,
  CityCard,
  CityCardMobile,
  Country,
  CountryCard,
  LocationInfo,
} from "@/entities/location";
import { ArrowRightLineIcon, HeaderArrow, MobileCityArrowIcon } from "@/shared/assets";
import { useYandexMetrika } from "@/shared/hooks";
import { useDebounce } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { routes } from "@/shared/router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
} from "@/shared/ui";
import { EmptyList } from "@/shared/ui/empty-list";
import { filteredCountriesFn } from "../lib/filteredCountries";

type LocationSelectProps = {
  countries: Country[];
  cityInfo?: LocationInfo | null;
};

export const LocationSelect = (props: LocationSelectProps) => {
  const { countries, cityInfo: initialCityInfo } = props;
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchParamsCity = searchParams.get("city");
  const pathname = usePathname();
  const { cashCountrySelect } = useYandexMetrika();
  const city = searchParamsCity ? searchParamsCity : pathname === routes.home ? "msk" : null;
  const [cityInfo, setCityInfo] = useState<LocationInfo | null>(initialCityInfo || null);
  
  useEffect(() => {
    if (initialCityInfo) {
      setCityInfo(initialCityInfo);
    }
  }, [initialCityInfo]);

  const ref = useRef<HTMLInputElement>(null);
  const [selectCountry, setSelectCountry] = useState<Country | null>(null);
  const [selectCity, setSelectCity] = useState<City | null>(null);
  const [locationSearchValue, setLocationSearchValue] = useState<string>("");

  const debouncedLocationSearchValue = useDebounce(locationSearchValue, 500);

  const onClickCountry = (country: Country) => {
    setSelectCountry(country);
  };
  // убрать очистку городов и пушить город в url
  const onClickCity = (city: City) => {
    setSelectCity(city);
    cashCountrySelect();
  };

  const filteredCountries = useMemo(() => {
    return filteredCountriesFn(countries, debouncedLocationSearchValue);
  }, [countries, debouncedLocationSearchValue]);

  const cityList = useMemo(() => {
    if (selectCountry) {
      return filteredCountries.find((country) => country.id === selectCountry.id)?.cities || [];
    }
    return [];
  }, [filteredCountries, selectCountry]);
  //fix
  useEffect(() => {
    if (filteredCountries.length > 0 && !selectCountry) {
      setSelectCountry(filteredCountries[0]);
    }
  }, [filteredCountries, ref.current?.onchange, selectCountry]);

  if (isDesktop) {
    return (
      <div className="flex items-center justify-center">
        <Dialog onOpenChange={() => setLocationSearchValue("")}>
          <DialogTrigger className="cursor-pointer hover:bg-new-grey duration-300 bg-transparent flex items-center justify-between py-3.5 px-12 rounded-[15px]">
            {cityInfo ? (
              <div className="flex items-center gap-5 uppercase text-font-light-grey">
                <Image
                  width={38}
                  height={38}
                  src={cityInfo?.country?.icon_url}
                  alt={`Город ${cityInfo?.name?.ru}`}
                />
                <p className="lg:text-lg text-base leading-none">
                  {cityInfo?.country?.name?.ru}, {cityInfo?.name?.ru}
                </p>
                <span className="border border-font-light-grey rounded-[6px]">
                  <ChevronDown />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-5 uppercase text-font-light-grey">
                <Circle width={38} height={38} />
                <p className="lg:text-lg text-base leading-none">Выберите город</p>
                <span className="border border-font-light-grey rounded-[6px]">
                  <ChevronDown />
                </span>
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] lg:py-[50px] lg:px-[40px] bg-new-dark-grey flex flex-col border-none md:w-[90vw] xl:w-[80vw] h-[65dvh] rounded-[20px] gap-6">
            <DialogDescription className="sr-only"></DialogDescription>
            <div className="grid grid-cols-[1fr,auto,1fr] grid-rows-1 items-center gap-4">
              <DialogTitle className="lg:text-[22px] text-lg m-0 uppercase text-yellow-main">
                Выбор города
              </DialogTitle>
              <div className="opacity-0 flex items-center justify-center">
                <ArrowRightLineIcon width={22} className="fill-yellow-main " />
              </div>
              <div className="relative">
                <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
                <Input
                  ref={ref}
                  className="rounded-[10px] pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal  placeholder:transition-opacity focus:placeholder:opacity-0"
                  value={locationSearchValue}
                  onChange={(e) => setLocationSearchValue(e.target.value)}
                  placeholder="Поиск города и страны"
                  color="#BBBBBB"
                />
              </div>
            </div>
            {filteredCountries.length > 0 ? (
              <div className="grid md:grid-cols-[1fr,auto,1fr] grid-rows-1 min-h-full gap-4">
                <ScrollArea className="bg-new-grey rounded-[10px] lg:h-[calc(100%_-_50px)] h-[calc(100%_-_64px)]">
                  <div className="flex flex-col">
                    {filteredCountries?.map((country) => (
                      <CountryCard
                        active={country.name.ru === selectCountry?.name.ru}
                        key={country.id}
                        onClick={() => onClickCountry(country)}
                        country={country}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center justify-center">
                  <ArrowRightLineIcon width={22} className="fill-yellow-main " />
                </div>
                <ScrollArea className="bg-new-grey rounded-[10px] lg:h-[calc(100%_-_50px)] h-[calc(100%_-_64px)]">
                  <div className="flex flex-col">
                    {selectCountry && cityList.length > 0
                      ? cityList.map((city) => (
                          <DialogClose asChild key={city.id}>
                            <CityCard
                              onClick={() => onClickCity(city)}
                              city={city}
                              active={selectCity?.code_name === city?.code_name}
                            />
                          </DialogClose>
                        ))
                      : filteredCountries?.map((country) =>
                          country.cities.map((city) => (
                            <DialogClose asChild key={city.id}>
                              <CityCard
                                onClick={() => onClickCity(city)}
                                city={city}
                                active={selectCity?.code_name === city?.code_name}
                              />
                            </DialogClose>
                          )),
                        )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <EmptyList />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  const accordionActiveItems = filteredCountries.map((location) => String(location.id));
  return (
    <Drawer onOpenChange={() => setLocationSearchValue("")}>
      <DrawerTrigger
        asChild
        className="cursor-pointer flex items-center justify-center py-0 px-0 rounded-[15px]"
      >
        {cityInfo ? (
          <div className="flex items-center gap-3 uppercase text-font-light-grey">
            <Image
              width={41}
              height={41}
              className="size-[30px]"
              src={cityInfo?.country?.icon_url}
              alt={`Город ${cityInfo?.name.ru}`}
            />
            <p className="mobile-xl:text-sm text-xs leading-none truncate max-w-[50vw]">
              {cityInfo.country.name.ru}, {cityInfo.name.ru}
            </p>
            <span className="border border-font-light-grey rounded-[6px]">
              <ChevronRight />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-5 uppercase text-font-light-grey">
            <Circle className="size-[30px]" />
            <p className="mobile-xl:text-sm text-xs leading-none truncate max-w-[50vw]">
              Выберите город
            </p>
            <span className="border border-font-light-grey rounded-[6px]">
              <ChevronDown />
            </span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-dvh px-4 rounded-none bg-transparent border-0">
        <DrawerTitle className="sr-only"></DrawerTitle>
        <DrawerDescription className="sr-only"></DrawerDescription>
        <div className="flex flex-col gap-4 bg-new-dark-grey -mx-4 px-4">
          <DrawerHeader className="flex p-0 items-center justify-between pt-16">
            <h2 className="uppercase font-bold text-yellow-main">Выбор города</h2>
            <DrawerClose>
              <MobileCityArrowIcon className="-rotate-90 w-5 h-5" fill="#fff" />
            </DrawerClose>
          </DrawerHeader>
          <div className="relative flex items-center">
            <SearchIcon color="#BBBBBB" className="absolute  left-2" />
            <Input
              value={locationSearchValue}
              onChange={(e) => setLocationSearchValue(e.target.value)}
              className="text-base rounded-[10px] pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal placeholder:transition-opacity focus:placeholder:opacity-0 leading-none"
              placeholder="Поиск страны и города"
              color="#BBBBBB"
            />
          </div>
          {filteredCountries.length > 0 ? (
            <ScrollArea className="h-[calc(100dvh_-_160px)] -mx-4">
              <Accordion
                value={debouncedLocationSearchValue.length > 0 ? accordionActiveItems : undefined}
                type="multiple"
                className="grid gap-4 pb-4 pt-4"
              >
                {filteredCountries.map((country) => (
                  <AccordionItem
                    className="relative px-0 py-0 grid bg-transparent group"
                    key={country.id}
                    value={String(country.id)}
                  >
                    {country?.is_popular && (
                      <span
                        className={
                          "z-10 absolute right-2 -translate-y-3 text-[10px] rounded-[3px] bg-yellow-main text-black text-center py-[2px] px-2 font-medium border border-new-dark-grey group-data-[state=open]:border-yellow-main group-data-[state=open]:text-yellow-main group-data-[state=open]:bg-new-dark-grey"
                        }
                      >
                        Популярное
                      </span>
                    )}
                    <AccordionTrigger
                      hideChevron={true}
                      className="relative border-0 px-5 py-2 group-data-[state=open]:text-black group-data-[state=open]:bg-yellow-main"
                    >
                      <CountryCard
                        key={country.id}
                        onClick={() => onClickCountry(country)}
                        country={country}
                      />
                    </AccordionTrigger>
                    <AccordionContent className="py-4 px-5 grid gap-6 text-white group-data-[state=open]:bg-[#393C44]">
                      {country?.cities.map((city) => (
                        <DrawerClose asChild key={city?.id} className="w-full px-0 pl-[6px]">
                          <CityCardMobile city={city} onClick={() => onClickCity(city)} />
                        </DrawerClose>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          ) : (
            <div className="h-[80dvh]">
              <EmptyList />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
