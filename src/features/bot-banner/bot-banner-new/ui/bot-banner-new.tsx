import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBannerNew = ({ isExchange }: { isExchange?: true }) => {
  return (
    <Link
      href={products.telegram_bot}
      target="_blank"
      rel="noopener noreferrer"
      className={`${isExchange ? "" : "mx-auto"} w-fit relative z-1 cursor-pointer grid grid-flow-col gap-4 justify-center items-center justify-items-center bg-[#039BE5] rounded-[10px] py-3 px-4 hover:scale-[1.025] duration-300 active:scale-[0.99]`}
    >
      <div className="relative bg-[#039BE5] xl:h-11 xl:w-11 mobile-xl:h-10 mobile-xl:w-10 h-6 w-6 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center cursor-pointer rounded-full border-white border-[1px]">
        <TelegramIcon
          width={24}
          height={24}
          className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[54%]"
        />
      </div>
      <div className="uppercase font-normal xl:text-sm mobile:text-xs text-2xs leading-snug">
        <p className={`${isExchange ? "text-start" : "text-center"} truncate`}>Больше функций</p>
        <p className={`${isExchange ? "text-start" : "text-center"} truncate`}>
          В нашем телеграм-боте
        </p>
      </div>
    </Link>
  );
};
