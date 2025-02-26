import Image from "next/image";
import Link from "next/link";
import bot_banner from "/public/bot_banner_blog.png";
import { TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBannerBlog = () => {
  return (
    <>
      <Link
        href={products.telegram_channel}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-xl:block hidden w-full"
      >
        <Image src={bot_banner} alt="banner" className="w-full h-auto object-contain" />
      </Link>
      <div className="mobile-xl:hidden grid justify-center justify-items-center gap-2 p-3 bg-new-dark-grey rounded-[8px]">
        <p className="mobile:text-xs text-2xs text-font-light-grey font-normal text-center">
          Новости, обзоры, комментарии и многое другое в нашем телеграм канале
        </p>
        <Link
          href={products.telegram_channel}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit cursor-pointer grid grid-flow-col gap-2 justify-center items-center justify-items-center bg-[#039BE5] rounded-[5px] p-2 hover:scale-[1.025] duration-300 active:scale-[0.99]"
        >
          <div className="bg-[#039BE5] rounded-full xl:h-11 xl:w-11 mobile-xl:h-10 mobile-xl:w-10 h-6 w-6 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center [&>a>svg]:w-[14px]">
            <TelegramIcon />
          </div>
          <p className="mobile:text-xs text-2xs font-normal uppercase">moneyswap_robot</p>
        </Link>
      </div>
    </>
  );
};
