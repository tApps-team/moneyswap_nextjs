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
    <aside className="bg-[#2d2d2d]   grid grid-cols-1 grid-flow-row gap-4 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-6 rounded-2xl">
      <p className="text-white uppercase">ТОП ОБМЕННИКОВ</p>
      <ScrollArea className="max-h-96 pr-4 ">
        <div className="flex flex-col gap-4 ">
          {topExchangers?.map((topExchanger) => (
            <div key={topExchanger.id} className="flex  justify-between items-center">
              <div className="flex gap-2 items-center">
                <Image
                  src={topExchanger.iconUrl}
                  alt={`coin ${topExchanger.name}`}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col gap-0 uppercase">
                  <p className="text-sm">{topExchanger.name}</p>
                  <div className="flex  gap-1 text-xs uppercase">
                    <p>Отзывы</p>
                    <span className="text-[#f6ff5f] font-medium">
                      {topExchanger.reviewCount.positive}
                    </span>
                    <span>/</span>
                    <span className="text-red-500 font-medium">
                      {topExchanger.reviewCount.negative}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={{
                  pathname: `/crypto-exchangers/exchanger-${topExchanger.id}`,
                  query: { "exchanger-marker": topExchanger.exchangerMarker },
                }}
                className="uppercase text-[#f6ff5f]"
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
