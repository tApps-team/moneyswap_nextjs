"use client";

import { ArrowRight, Calendar, Check, Clock, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExchangerCardArrow } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { Exchanger, ExchangerMarker } from "..";

type ExchangerCardProps = {
  exchanger: Exchanger;
  city?: string;
};
export const ExchangerCard = (props: ExchangerCardProps) => {
  const { exchanger, city } = props;
  const isAnyTrue = (workingDays: Record<string, boolean>, exchangerName: string): boolean => {
    return Object.values(workingDays).some((value) => value === true);
  };
  const router = useRouter();

  return (
    <Link target="_blank" href={exchanger.partner_link} className={cn("relative z-10")}>
      {exchanger?.is_vip && (
        <div className="flex justify-center items-center bg-yellow-main absolute mobile-xl:-top-2 -top-1.5 right-4 px-4 mobile-xl:h-5 h-4 py-0.5 rounded-[3px] text-black font-bold ">
          <span className="block text-center uppercase mobile-xl:text-xs text-[9px] leading-none">
            Лучшее предложение
          </span>
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 grid-rows-[1fr,auto,1fr] gap-4 p-4 mobile-xl:rounded-2xl rounded-[10px] bg-new-dark-grey",
          exchanger?.is_vip && "border-yellow-main border-2",
        )}
      >
        <div className="grid grid-flow-col justify-between items-start">
          <div className="grid grid-flow-row items-stretch content-between h-full">
            <div>
              <h2 className="md:text-xl text-base font-normal truncate leading-none">
                {exchanger?.name?.ru}
              </h2>
            </div>
            <div className="flex items-end justify-between">
              <p className="md:text-base mobile-xl:text-sm text-xs text-yellow-main  font-normal">
                {city ? `в г. ${city}` : "Онлайн-обмен"}
              </p>
            </div>
          </div>
          <div className="rounded-[6px] border border-[#575A62] gap-1 grid lg:grid-flow-col grid-flow-row justify-items-center justify-center p-1.5">
            <span
              onClick={(e) => {
                e.preventDefault();
                router.push(
                  `${routes.exchangers}/exchanger-${exchanger.exchange_id}?exchanger-marker=${exchanger.exchange_marker}`,
                );
              }}
              className="md:text-base mobile-xl:text-sm text-xs font-medium leading-none "
            >
              Отзывы
            </span>
            <div className="flex gap-1 items-center md:text-base mobile-xl:text-xs text-2xs">
              <p className="text-yellow-main leading-none ">{exchanger?.review_count?.positive}</p>
              <div className="text-2xs text-white leading-none">|</div>
              <p className="text-light-gray leading-none">{exchanger?.review_count?.neutral}</p>
              <div className="text-2xs leading-none">|</div>
              <p className="text-[#D20000] leading-none">{exchanger?.review_count?.negative}</p>
            </div>
          </div>
        </div>
        {exchanger?.info ? (
          <span className="text-[7px] font-medium h-4 flex py-2 gap-1 bg-yellow-main items-center justify-center -mx-4">
            {(exchanger?.info?.weekdays?.time_from || exchanger?.info?.weekdays?.time_to) && (
              <div className="flex gap-1 items-center">
                <Clock className="size-2.5" color="black" />
                <p className="text-black">
                  {exchanger?.info?.weekdays?.time_from} - {exchanger?.info?.weekdays?.time_to}
                </p>
              </div>
            )}
            {isAnyTrue(exchanger?.info?.working_days || {}, exchanger?.name?.ru) && (
              <div className="flex items-center gap-1">
                <Calendar className="size-2.5" color="black" />
                <div className="text-black">
                  {Object.entries(exchanger?.info?.working_days || {}).map(
                    ([day, isWorking], index) =>
                      isWorking && (
                        <span key={day}>
                          {day}
                          {index === Object.keys(exchanger?.info?.working_days || {}).length - 1
                            ? ""
                            : "/"}
                        </span>
                      ),
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center text-black">
              {exchanger.info?.delivery ? (
                <Check className="size-2.5" />
              ) : (
                <X className="size-2.5" />
              )}
              <p>ДОСТАВКА</p>
            </div>
            <div className="flex items-center text-black">
              {exchanger.info?.office ? <Check className="size-2.5" /> : <X className="size-2.5" />}
              <p>ОФИС</p>
            </div>
          </span>
        ) : (
          <hr className=" border-[#575A62]" />
        )}
        <div className="grid grid-flow-row content-between">
          <div className="flex md:text-base text-sm items-center gap-2">
            <div className="flex gap-2  items-center">
              <p className="font-semibold leading-none">{exchanger?.in_count}</p>
              <p className="font-light leading-none truncate mobile-xl:max-w-[35vw] max-w-[18vw]">
                {exchanger?.valute_from}
              </p>
            </div>
            <ExchangerCardArrow className="size-3 min-h-3 min-w-3" fill="#f6ff5f" />
            <div className="flex gap-2 items-center">
              <p className="font-semibold leading-none">{exchanger?.out_count}</p>
              <p className="font-light leading-none truncate mobile-xl:max-w-[35vw] max-w-[18vw]">
                {exchanger?.valute_to}
              </p>
            </div>
          </div>
          <div className="pt-0.5">
            <p className="md:text-base mobile-xl:text-sm text-xs text-yellow-main font-light">
              Обмен от {exchanger?.min_amount} до {exchanger?.max_amount}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
