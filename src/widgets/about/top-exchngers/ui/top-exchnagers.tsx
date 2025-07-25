import Image from "next/image";
import Link from "next/link";
import { DownPercent, UpPercent } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { ExchangerMarker, Review } from "@/shared/types";
import { ScrollArea } from "@/shared/ui";
import { getTopExchangers } from "..";

export const TopExchangers = async () => {
  const topExchangers = await getTopExchangers();
  return (
    <aside className="bg-new-dark-grey grid grid-cols-1 grid-flow-row gap-4 py-6 px-3 rounded-2xl">
      <p className="text-white uppercase font-bold text-center text-base">ТОП ОБМЕННИКОВ</p>
      <ScrollArea className="max-h-96 px-3">
        <div className="flex flex-col gap-4  ">
          {topExchangers?.map((topExchanger) => (
            <div
              key={topExchanger?.id}
              className="flex pb-3 border-b border-[#34363A] last:border-none  justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={topExchanger?.iconUrl}
                  alt={`coin ${topExchanger?.name}`}
                  width={100}
                  height={100}
                  className="size-8 md:size-10 rounded-full"
                />
                <div className="flex flex-col min-w-0 gap-0 ">
                  <p className="text-sm truncate md:text-base font-bold">{topExchanger?.name}</p>
                  <div className="flex gap-1 items-center md:text-sm text-xs">
                    <p className="text-yellow-main font-semibold ">Отзывы</p>
                    <span className="text-yellow-main">{topExchanger?.reviewCount?.positive}</span>
                    <span>|</span>
                    <span className="text-white">{topExchanger?.reviewCount?.neutral}</span>
                    <span>|</span>
                    <span className="text-red-500">{topExchanger?.reviewCount?.negative}</span>
                  </div>
                </div>
              </div>
              <Link
                href={{
                  pathname: `/crypto-exchangers/exchanger-${topExchanger?.id}__${topExchanger?.exchangerMarker}`,
                }}
                className=" bg-new-grey hover:bg-yellow-main hover:text-black py-2.5 px-5 rounded-[10px] font-semibold text-xs md:text-sm text-white"
              >
                Перейти
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
