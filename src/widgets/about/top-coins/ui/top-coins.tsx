import Image from "next/image";
import { DownPercent, UpPercent } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { ScrollArea } from "@/shared/ui";

type TopCoins = {
  id: number;
  iconUrl: string;
  name: string;
  code_name: string;
  course: number;
  isIncrease: boolean;
  percent: number;
};
const topCoins: TopCoins[] = [
  {
    id: 1,
    course: 23232323,
    name: "Bitcoin",
    isIncrease: true,
    percent: 22,
    code_name: "BTC",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/BTC.svg",
  },
  {
    id: 2,
    course: 1000,

    isIncrease: false,
    percent: 22,
    name: "Ethereum",
    code_name: "ETH",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/ETH.svg",
  },
  {
    id: 3,
    course: 2323,
    name: "Tether TRC20 USDT",
    isIncrease: true,
    percent: 22,
    code_name: "USDTTRC20",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/USDTTRC20.svg",
  },
  {
    id: 4,
    course: 123,

    isIncrease: true,
    percent: 22,
    name: "Litecoin",
    code_name: "LTC",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/LTC.svg",
  },
  {
    id: 5,
    course: 123,

    isIncrease: true,
    percent: 22,
    name: "Litecoin",
    code_name: "LTC",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/LTC.svg",
  },
  {
    id: 6,
    course: 123,

    isIncrease: true,
    percent: 22,
    name: "Litecoin",
    code_name: "LTC",
    iconUrl: "https://api.moneyswap.online/media/icons/valute/LTC.svg",
  },
];
export const TopCoins = () => {
  return (
    <div className="bg-[#2d2d2d]   grid grid-cols-1 grid-flow-row gap-4 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-6 rounded-2xl">
      <p className="text-white uppercase">ТОП МОНЕТ</p>
      <ScrollArea className="max-h-96 pr-4 ">
        <div className="flex flex-col gap-4 ">
          {topCoins.map((topCoin) => (
            <div
              key={topCoin.id}
              className="flex pb-3 border-b last:border-none justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={topCoin.iconUrl}
                  alt={`coin ${topCoin.code_name}`}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col gap-0">
                  <p className="text-sm">{topCoin.code_name}</p>
                  <span className="text-xs uppercase">
                    {topCoin.name} ({topCoin.code_name})
                  </span>
                </div>
              </div>
              <div className="text-end ">
                <p className="text-sm text-nowrap">{topCoin.course} USD</p>
                <div className="text-xs flex items-center justify-end gap-2">
                  {topCoin.isIncrease ? (
                    <UpPercent color="#f6ff5f" className="" width={9} height={9} />
                  ) : (
                    <DownPercent width={9} height={9} />
                  )}
                  <span className={cn("", topCoin.isIncrease && "text-[#f6ff5f]")}>
                    {topCoin.percent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
