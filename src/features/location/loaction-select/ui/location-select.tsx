"use client";
import { ChevronDown, ChevronRight, CircleSlash2, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  City,
  CityCard,
  CityCardMobile,
  Country,
  CountryCard,
  LocationInfo,
  getSpecificCity,
} from "@/entities/location";
import { ArrowRightLineIcon, HeaderArrow } from "@/shared/assets";
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
};

export const LocationSelect = (props: LocationSelectProps) => {
  const { countries } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchParamsCity = searchParams.get("city");
  const pathname = usePathname();

  const city = searchParamsCity ? searchParamsCity : pathname === routes.home ? "msk" : null;
  const [cityInfo, setCityInfo] = useState<LocationInfo | null>(null);
  useEffect(() => {
    if (city) {
      getSpecificCity({ codeName: city }).then((data) => setCityInfo(data));
    }
  }, [city]);

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
    const params = new URLSearchParams(searchParams);
    params.set("city", city.code_name.toString());
    router.push(pathname + "?" + params);
    // setLocation(location);
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
      <Dialog onOpenChange={() => setLocationSearchValue("")}>
        <DialogTrigger className="bg-transparent flex items-center justify-between py-3.5 px-12 rounded-[15px]">
          {cityInfo ? (
            <div className="flex items-center gap-5 uppercase text-font-light-grey">
              <Image
                width={41}
                height={41}
                src={cityInfo?.country?.icon_url}
                alt={`Город ${cityInfo?.name.ru}`}
              />
              <p>
                {cityInfo.country.name.ru}, {cityInfo.name.ru}
              </p>
              <span className="border border-font-light-grey rounded-[6px]">
                <ChevronDown />
              </span>
            </div>
          ) : (
            <p>Выберите город</p>
          )}
        </DialogTrigger>
        <DialogContent className="bg-new-dark-grey flex flex-col border-none md:w-[80vw] xl:w-[60vw] xl:h-[65svh] rounded-[20px]  gap-6">
          <DialogDescription className="sr-only"></DialogDescription>
          <div className="grid grid-cols-2 grid-rows-1 items-center">
            <DialogTitle className="m-0 uppercase text-yellow-main">Выбор города</DialogTitle>
            <div className="relative">
              <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
              <Input
                ref={ref}
                className="rounded-[10px]  pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal  placeholder:transition-opacity focus:placeholder:opacity-0"
                value={locationSearchValue}
                onChange={(e) => setLocationSearchValue(e.target.value)}
                placeholder="Поиск города и страны"
                color="#BBBBBB"
              />
            </div>
          </div>
          {filteredCountries.length > 0 ? (
            <div className="grid md:grid-cols-[1fr,3rem,1fr] xl:grid-cols-[1fr,8rem,1fr] grid-rows-1 min-h-full  ">
              <ScrollArea className="h-[50svh] bg-new-grey  rounded-xl py-9 px-7">
                <div className="flex flex-col gap-3">
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
                <ArrowRightLineIcon width={22} className=" fill-white " />
              </div>
              <ScrollArea className="h-[50svh] bg-new-grey  rounded-xl py-9 px-7">
                <div className="  flex  flex-col  gap-3 ">
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
    );
  }
  const accordionActiveItems = filteredCountries.map((location) => String(location.id));
  return (
    <Drawer onOpenChange={() => setLocationSearchValue("")}>
      <DialogTrigger className="bg-transparent flex items-center justify-between py-3.5 px-12 rounded-[15px]">
        {cityInfo ? (
          <div className="flex items-center gap-5 uppercase text-font-light-grey">
            <Image
              width={41}
              height={41}
              className="size-[30px] md:size-[41px]"
              src={cityInfo?.country?.icon_url}
              alt={`Город ${cityInfo?.name.ru}`}
            />
            <p className="text-white text-xs">
              {cityInfo.country.name.ru}, {cityInfo.name.ru}
            </p>
            <span className="border border-font-light-grey rounded-[6px]">
              <ChevronRight />
            </span>
          </div>
        ) : (
          <p>Выберите город</p>
        )}
      </DialogTrigger>
      <DrawerContent className="h-dvh px-4 rounded-none bg-new-dark-grey border-0">
        <DrawerTitle className="sr-only"></DrawerTitle>
        <DrawerDescription className="sr-only"></DrawerDescription>
        <div className="flex flex-col gap-4">
          <DrawerHeader className="flex p-0 items-center justify-between pt-16">
            <h2 className="uppercase font-normal">Выбор города</h2>
            <DrawerClose>
              <HeaderArrow className="size-5" />
            </DrawerClose>
          </DrawerHeader>
          <div className="relative flex items-center">
            <SearchIcon color="#BBBBBB" className="absolute  left-2" />
            <Input
              value={locationSearchValue}
              onChange={(e) => setLocationSearchValue(e.target.value)}
              className="rounded-[10px]  pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal  placeholder:transition-opacity focus:placeholder:opacity-0"
              placeholder="ПОИСК СТРАНЫ И ГОРОДА"
              color="#BBBBBB"
            />
          </div>
          {filteredCountries.length > 0 ? (
            <ScrollArea className="h-[calc(100dvh_-_160px)] -mx-4 ">
              <Accordion
                value={debouncedLocationSearchValue.length > 0 ? accordionActiveItems : undefined}
                type="multiple"
                className="w-full flex px-4 pb-3 pt-1 flex-col "
              >
                {filteredCountries.map((country) => (
                  <AccordionItem
                    className="flex flex-col px-0 py-0  gap-2"
                    key={country.id}
                    value={String(country.id)}
                  >
                    <AccordionTrigger
                      hideChevron={true}
                      className=" w-full border-0  py-2 group-data-[state=open]:text-black group-data-[state=open]:bg-yellow-main"
                    >
                      <CountryCard
                        active={country.name.ru === selectCountry?.name.ru}
                        key={country.id}
                        onClick={() => onClickCountry(country)}
                        country={country}
                      />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1  ">
                      {country.cities.map((city) => (
                        <DrawerClose key={city?.id} className="w-full px-2">
                          <CityCardMobile city={city.name.ru} onClick={() => onClickCity(city)} />
                        </DrawerClose>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          ) : (
            <EmptyList />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
