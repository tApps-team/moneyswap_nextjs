import Image from "next/image";
import { DownPercent, UpPercent } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { ScrollArea } from "@/shared/ui";
import { getTopCoins } from "..";

export const TopCoins = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const topCoins = await getTopCoins();
  console.log(topCoins);

  return (
    <section className="bg-new-dark-grey   grid grid-cols-1 grid-flow-row gap-4 py-6 px-3 rounded-2xl">
      <p className="text-white uppercase text-center font-bold text-base">ТОП МОНЕТ</p>
      <ScrollArea className="max-h-96 px-3">
        <div className="flex flex-col gap-4 ">
          {topCoins?.map((topCoin) => (
            <div
              key={topCoin?.id + topCoin?.code_name}
              className="flex  pb-3 border-b border-[#34363A] last:border-none justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={topCoin?.iconUrl}
                  alt={`coin ${topCoin?.code_name}`}
                  width={100}
                  height={100}
                  className="size-8 md:size-10"
                />
                <div className="flex  flex-col gap-0">
                  <p className="md:text-base text-sm font-bold truncate">{topCoin?.code_name}</p>
                  <span className="md:text-sm text-xs text-font-dark-grey uppercase font-normal truncate">
                    {topCoin?.name}
                  </span>
                </div>
              </div>
              <div className="text-end ">
                <p className="md:text-sm text-xs font-bold text-nowrap">
                  {topCoin?.course?.toFixed(4) || 0} <span className="font-bold">USD</span>
                </p>
                <div className="text-xs flex items-center justify-end gap-2">
                  {topCoin?.isIncrease ? (
                    <UpPercent color="#f6ff5f" className="" width={9} height={9} />
                  ) : (
                    <DownPercent width={9} height={9} />
                  )}
                  <span className={cn("", topCoin.isIncrease && "font-semibold text-yellow-main")}>
                    {topCoin?.percent ? topCoin?.percent.toFixed(3) : "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
