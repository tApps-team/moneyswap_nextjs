import Link from "next/link";
import { products } from "@/shared/router";
import { TelegramButton } from "@/shared/ui";

export const BotBannerNew = ({ isExchange }: { isExchange?: true }) => {
  return (
    <Link
      href={products.telegram_bot}
      target="_blank"
      rel="noopener noreferrer"
      className={`${isExchange ? "" : "mx-auto"} w-fit relative z-50 cursor-pointer grid grid-flow-col gap-4 justify-center items-center justify-items-center bg-[#039BE5] rounded-[10px] py-3 px-4 hover:scale-[1.025] duration-300 active:scale-[0.99]`}
    >
      <div className="grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center cursor-pointer rounded-full border-white border-[1px]">
        <TelegramButton />
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
