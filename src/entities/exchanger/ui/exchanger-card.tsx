import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Exchanger, ExchangerMarker } from "..";

type ExchangerCardProps = {
  exchanger: Exchanger;
  city?: string;
};
export const ExchangerCard = (props: ExchangerCardProps) => {
  const { exchanger, city } = props;

  return (
    //relative z-10
    <Link
      href={exchanger.partner_link}
      target="_blank"
      className={cn("", exchanger.is_vip ? "pt-10 first:pt-2" : "pt-0")}
    >
      {exchanger.is_vip && (
        <div className="bg-yellow-main absolute w-full h-16 rounded-3xl   text-black font-bold  -z-10 -translate-y-6 ">
          <p className="text-center "> VIP - ПАРТНЕР</p>
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
          <h2 className="font-bold truncate">{exchanger.name.ru}</h2>
          <div className="flex items-end justify-between">
            <p className="uppercase text-2xs text-yellow-main">
              {exchanger.exchange_marker === ExchangerMarker.cash ? `в г. ${city}` : "Онлайн обмен"}
            </p>
            <div className="rounded-full border border-light-gray  gap-2 flex justify-between items-center p-1.5 text-2xs">
              <p className="text-3xs font-medium leading-none">ОТЗЫВЫ</p>
              <div className="flex gap-1 items-center">
                <p className="text-yellow-main text-3xs  leading-none ">
                  {exchanger.review_count.positive}
                </p>
                <div className="text-[6px] leading-none mb-[2px]">|</div>
                <p className="text-light-gray text-3xs  leading-none">
                  {exchanger.review_count.negative}
                </p>
              </div>
            </div>
          </div>
        </div>
        {exchanger.is_vip ? (
          <span className=" h-4 flex py-2 bg-yellow-main items-center justify-center -mx-4">
            <Clock className="size-3 " color="black" />
            <p className="text-2xs text-black">
              {exchanger.info?.time_from} - {exchanger.info?.time_to}
            </p>
            <Calendar className="size-3" color="black" />
            <div>
              {exchanger.info?.working_days &&
                Object.entries(exchanger.info.working_days).map(
                  ([day, isWorking]) => !isWorking && <span key={day}>{day}</span>,
                )}
            </div>
          </span>
        ) : (
          <hr className="-mx-4 bg-light-gray" />
        )}
        <div>
          <div className="flex text-xs items-center gap-2">
            <div className="flex gap-2  items-center">
              <p className="font-bold">{exchanger.in_count}</p>
              <p>{exchanger.valute_from}</p>
            </div>
            <ArrowRight className="size-4 min-h-4 min-w-4" />
            <div className="flex gap-2  items-center">
              <p className="font-bold">{exchanger.out_count}</p>
              <p>{exchanger.valute_to}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-yellow-main">
              Обмен от {exchanger.min_amount} до {exchanger.max_amount}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
