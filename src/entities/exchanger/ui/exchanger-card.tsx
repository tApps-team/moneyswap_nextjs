import { ArrowRight, Calendar, Check, Clock, X } from "lucide-react";
import Link from "next/link";
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
  return (
    //relative z-10
    <div className={cn("relative z-10", exchanger.is_vip ? "pt-5" : "pt-0")}>
      {exchanger.is_vip && (
        <div className="bg-yellow-main absolute w-full h-16 rounded-3xl   text-black font-bold  -z-10 -translate-y-6 ">
          <p className="text-center uppercase">Лучшее предложение</p>
        </div>
      )}

      <div
        className={cn(
          "  grid grid-cols-1 gap-4 p-4 rounded-3xl bg-dark-gray",
          exchanger.is_vip
            ? "border border-yellow-main"
            : "shadow-[1px_2px_8px_3px_rgba(0,0,0,0.5)]",
        )}
      >
        <div>
          <Link target="_blank" href={exchanger.partner_link}>
            <h2 className="mobile-xl:font-bold font-semibold truncate leading-none">
              {exchanger.name.ru}
            </h2>
          </Link>
          <div className="flex items-end justify-between">
            <p className="text-xs text-yellow-main">
              {exchanger.exchange_marker === ExchangerMarker.cash ? `в г. ${city}` : "Онлайн обмен"}
            </p>
            <div className="rounded-full border border-light-gray  gap-2 flex justify-between items-center p-1.5 text-2xs">
              <Link
                href={`${routes.exchangers}/exchanger-${exchanger.exchange_id}?exchanger-marker=${exchanger.exchange_marker}`}
                className="text-3xs font-medium leading-none uppercase"
              >
                ОТЗЫВЫ
              </Link>
              <div className="flex gap-1 items-center">
                <p className="text-yellow-main text-3xs leading-none ">
                  {exchanger.review_count.positive}
                </p>
                <div className="text-[6px] leading-none">|</div>
                <p className="text-light-gray text-3xs leading-none">
                  {exchanger.review_count.negative}
                </p>
              </div>
            </div>
          </div>
        </div>
        {exchanger.is_vip ? (
          <span className=" h-4 flex py-2 gap-1 bg-yellow-main items-center justify-center -mx-4">
            {exchanger.info?.time_from ||
              (exchanger.info?.time_to && (
                <div>
                  <Clock className="size-3 " color="black" />
                  <p className="text-3xs text-black">
                    {exchanger.info?.time_from} - {exchanger.info?.time_to}
                  </p>
                </div>
              ))}
            {isAnyTrue(exchanger.info?.working_days || {}, exchanger.name.ru) && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3" color="black" />
                <div className="text-black  text-3xs">
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

            <div className="flex items-center text-3xs text-black">
              {exchanger.info?.delivery ? <Check className="size-4" /> : <X className="size-4" />}
              <p>ДОСТАВКА</p>
            </div>
            <div className="flex items-center text-3xs text-black">
              {exchanger.info?.office ? <Check className="size-4" /> : <X className="size-4" />}
              <p>ОФИС</p>
            </div>
          </span>
        ) : (
          <hr className="-mx-4 bg-light-gray" />
        )}
        <div>
          <div className="flex text-sm items-center gap-2">
            <div className="flex gap-2  items-center">
              <p className="font-semibold">{exchanger.in_count}</p>
              <p>{exchanger.valute_from}</p>
            </div>
            <ExchangerCardArrow className="size-3 min-h-3 min-w-3" fill="#f6ff5f" />
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{exchanger.out_count}</p>
              <p>{exchanger.valute_to}</p>
            </div>
          </div>
          <div className="pt-0.5">
            <p className="text-xs text-yellow-main">
              Обмен от {exchanger.min_amount} до {exchanger.max_amount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
