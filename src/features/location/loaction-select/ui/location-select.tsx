"use client";
import { ChevronDown, CircleSlash2, SearchIcon, X } from "lucide-react";
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
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  ScrollArea,
} from "@/shared/ui";
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
        <DialogTrigger className="cursor-pointer" asChild>
          <div className="lg:bg-dark-gray   lg:rounded-full lg:h-16 lg:border-2 gap-2 lg:border-light-gray items-center p-3 flex justify-between">
            <div className="flex items-center gap-4">
              {cityInfo ? (
                <figure className="hidden lg:w-[36px] lg:block  lg:rounded-full lg:overflow-hidden lg:h-[36px]">
                  <Image
                    alt={`${cityInfo?.code_name})`}
                    src={cityInfo?.country.icon_url}
                    width={36}
                    height={36}
                  />
                </figure>
              ) : (
                <CircleSlash2
                  className="lg:block hidden"
                  width={36}
                  height={36}
                  stroke="#bbb"
                  strokeWidth={"1.5px"}
                />
              )}

              <p className="md:text-base text-3xs truncate uppercase">
                {cityInfo ? cityInfo?.name.ru : "Не выбрано..."}
              </p>
            </div>
            <div>
              <ChevronDown color="white" className="lg:size-8" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-dark-gray  border-none md:w-[80svw] xl:w-[50svw] xl:h-[65svh] rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] grid gap-6">
          <div className="grid grid-cols-2 grid-rows-1 items-center">
            <DialogTitle className="m-0 uppercase">Выбор города</DialogTitle>
            <div className="relative">
              <SearchIcon className="absolute translate-y-2 left-3 " color="#bbbbbb" />
              <Input
                ref={ref}
                className="rounded-full bg-transparent pl-10 placeholder:uppercase placeholder:text-light-gray placeholder:font-semibold border-light-gray"
                value={locationSearchValue}
                onChange={(e) => setLocationSearchValue(e.target.value)}
                placeholder="Поиск города и страны"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr,3rem,1fr] xl:grid-cols-[1fr,8rem,1fr] grid-rows-1 min-h-full  ">
            <ScrollArea className="h-[50svh] border rounded-3xl p-4">
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
            <div className="flex items-center justify-center ">
              <ArrowRightLineIcon width={22} className=" fill-white " />
            </div>
            <ScrollArea className="h-[50svh] border rounded-3xl p-4">
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
        </DialogContent>
      </Dialog>
    );
  }
  const accordionActiveItems = filteredCountries.map((location) => String(location.id));
  return (
    <Drawer onOpenChange={() => setLocationSearchValue("")}>
      <DrawerTrigger className="cursor-pointer" asChild>
        <div className="lg:bg-dark-gray  lg:rounded-full lg:h-16 lg:border-2 gap-2 lg:border-light-gray items-center lg:p-3 flex justify-between">
          <div className="flex items-center gap-4">
            {cityInfo ? (
              <figure className="hidden lg:w-[36px]  lg:rounded-full lg:overflow-hidden lg:h-[36px]">
                <Image
                  alt={`${cityInfo?.code_name})`}
                  src={cityInfo?.country.icon_url}
                  width={36}
                  height={36}
                />
              </figure>
            ) : (
              <CircleSlash2
                className="lg:block hidden"
                width={36}
                height={36}
                stroke="#bbb"
                strokeWidth={"1.5px"}
              />
            )}

            <p className="lg:text-base text-2xs truncate uppercase">
              {cityInfo ? cityInfo?.name.ru : "Не выбрано..."}
            </p>
          </div>
          <div>
            <ChevronDown color="white" className="lg:size-8" />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-svh px-4 flex flex-col gap-4 bg-transparent  border-none">
        <DrawerHeader className="flex p-0 items-center justify-between pt-16">
          <h2 className="uppercase font-bold">Выбор города</h2>
          <DrawerClose>
            <HeaderArrow className="size-5" />
          </DrawerClose>
        </DrawerHeader>
        <div className="relative flex items-center">
          <SearchIcon color="#BBBBBB" className="absolute  left-2" />
          <Input
            value={locationSearchValue}
            onChange={(e) => setLocationSearchValue(e.target.value)}
            className="w-full pl-10 placeholder:text-base uppercase bg-dark-gray rounded-full  fill-light-gray placeholder:text-light-gray"
            placeholder="ПОИСК СТРАНЫ И ГОРОДА"
            color="#BBBBBB"
          />
        </div>
        <ScrollArea className="h-[80svh]">
          <Accordion
            value={debouncedLocationSearchValue.length > 0 ? accordionActiveItems : undefined}
            type="multiple"
            className="w-full flex  px-4 pb-3 pt-1 flex-col gap-4"
          >
            {filteredCountries.map((country) => (
              <AccordionItem
                className="flex flex-col  gap-2"
                key={country.id}
                value={String(country.id)}
              >
                <AccordionTrigger className="rounded-full bg-dark-gray hover:text-white flex items-center   uppercase font-medium text-sm p-4 shadow-[0px_2px_5px_1px_rgba(0,0,0,0.7)]">
                  <div className="flex items-center gap-3">
                    <Image
                      src={country.icon_url}
                      alt={`страна ${country.name.ru}`}
                      width={36}
                      height={36}
                    />
                    <p>{country.name.ru}</p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="py-2 grid gap-3">
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
      </DrawerContent>
    </Drawer>
  );
};
