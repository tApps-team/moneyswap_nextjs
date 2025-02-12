import Image from "next/image";
import Link from "next/link";
import { products } from "@/shared/router";
import { TelegramButton } from "@/shared/ui";

export const BotBannerBlog = () => {
  return (
    <>
      <Link
        href={products.telegram_channel}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-xl:block hidden w-full h-auto"
      >
        <Image
          src="/bot_banner_blog.png"
          alt="banner"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </Link>
      <div className="mobile-xl:hidden grid justify-center justify-items-center gap-2 p-3 bg-new-dark-grey rounded-[8px]">
        <p className="mobile:text-xs text-2xs text-font-light-grey font-normal text-center">
          Новости, обзоры, комментарии и многое другое в нашем телеграм канале
        </p>
        <Link
          href={products.telegram_channel}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit relative z-50 cursor-pointer grid grid-flow-col gap-2 justify-center items-center justify-items-center bg-[#039BE5] rounded-[5px] p-2 hover:scale-[1.025] duration-300 active:scale-[0.99]"
        >
          <div className="grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center [&>a>svg]:w-[14px]">
            <TelegramButton />
          </div>
          <p className="mobile:text-xs text-2xs font-normal uppercase">moneyswap_robot</p>
        </Link>
      </div>
    </>
  );
};
