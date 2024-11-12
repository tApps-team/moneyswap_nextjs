import { ChevronDown, CircleSlash2, SearchIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  City,
  CityCard,
  Country,
  CountryCard,
  LocationInfo,
  getSpecificCity,
} from "@/entities/location";
import { ArrowRightLineIcon } from "@/shared/assets";
import { useDebounce } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { routes } from "@/shared/router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
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
  const isDesktop = useMediaQuery("(min-width: 640px)");
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
          <div className="mobile-xl:bg-dark-gray   mobile-xl:rounded-full mobile-xl:h-16 mobile-xl:border-2 gap-2 mobile-xl:border-light-gray items-center p-3 flex justify-between">
            <div className="flex items-center gap-4">
              {cityInfo ? (
                <figure className="hidden mobile-xl:w-[36px] mobile-xl:block  mobile-xl:rounded-full mobile-xl:overflow-hidden mobile-xl:h-[36px]">
                  <Image
                    alt={`${cityInfo?.code_name})`}
                    src={cityInfo?.country.icon_url}
                    width={36}
                    height={36}
                  />
                </figure>
              ) : (
                <CircleSlash2
                  className="mobile-xl:block hidden"
                  width={36}
                  height={36}
                  stroke="#bbb"
                  strokeWidth={"1.5px"}
                />
              )}

              <p className="mobile-xl:text-base text-3xs truncate uppercase">
                {cityInfo ? cityInfo?.name.ru : "Не выбрано..."}
              </p>
            </div>
            <div>
              <ChevronDown color="white" className="mobile-xl:size-8" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-dark-gray  border-none w-[50svw] h-[65svh] rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] grid gap-6">
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

          <div className="grid grid-cols-[1fr,8rem,1fr] grid-rows-1 min-h-full  ">
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
                      <DialogClose key={city.id}>
                        <CityCard
                          onClick={() => onClickCity(city)}
                          city={city}
                          active={selectCity?.code_name === city?.code_name}
                        />
                      </DialogClose>
                    ))
                  : filteredCountries?.map((country) =>
                      country.cities.map((city) => (
                        <DialogClose key={city.id}>
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
  return (
    <Drawer onOpenChange={() => setLocationSearchValue("")}>
      <DrawerTrigger className="cursor-pointer" asChild>
        <div className="mobile-xl:bg-dark-gray  mobile-xl:rounded-full mobile-xl:h-16 mobile-xl:border-2 gap-2 mobile-xl:border-light-gray items-center p-3 flex justify-between">
          <div className="flex items-center gap-4">
            {cityInfo ? (
              <figure className="hidden mobile-xl:w-[36px]  mobile-xl:rounded-full mobile-xl:overflow-hidden mobile-xl:h-[36px]">
                <Image
                  alt={`${cityInfo?.code_name})`}
                  src={cityInfo?.country.icon_url}
                  width={36}
                  height={36}
                />
              </figure>
            ) : (
              <CircleSlash2
                className="mobile-xl:block hidden"
                width={36}
                height={36}
                stroke="#bbb"
                strokeWidth={"1.5px"}
              />
            )}

            <p className="mobile-xl:text-base text-2xs truncate uppercase">
              {cityInfo ? cityInfo?.name.ru : "Не выбрано..."}
            </p>
          </div>
          <div>
            <ChevronDown color="white" className="mobile-xl:size-8" />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-dark-gray min-h-svh ">
        <div className="grid grid-cols-2 grid-rows-1 items-center">
          <DrawerTitle className="m-0 uppercase">Выбор города</DrawerTitle>
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

        <div className="grid grid-cols-[1fr,8rem,1fr] grid-rows-1 min-h-full  ">
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
                    <DrawerClose key={city.id}>
                      <CityCard
                        onClick={() => onClickCity(city)}
                        city={city}
                        active={selectCity?.code_name === city?.code_name}
                      />
                    </DrawerClose>
                  ))
                : filteredCountries?.map((country) =>
                    country.cities.map((city) => (
                      <DrawerClose key={city.id}>
                        <CityCard
                          onClick={() => onClickCity(city)}
                          city={city}
                          active={selectCity?.code_name === city?.code_name}
                        />
                      </DrawerClose>
                    )),
                  )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
