import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBannerSidebar = () => {
  return (
    <section className="grid grid-flow-row gap-4 justify-center items-center w-full px-10 py-6 bg-new-dark-grey rounded-[15px]">
      <p className="uppercase font-normal mobile:text-xs text-2xs text-center">
        Переходи в наш бот, чтобы сделать обмен стало ещё проще и удобнее
      </p>
      <Link
        className="bg-[#039BE5] rounded-[10px] grid grid-flow-col p-4 mobile-xl:p-0 gap-2 justify-center items-center mobile-xl:h-[70px]  hover:scale-[1.025] active:scale-[0.995] transition-all duration-300"
        href={products.telegram_bot}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-white mobile-xl:text-sm text-2xs uppercase font-medium">
          moneyswap_robot
        </p>
        <TelegramIcon className="mobile-xl:size-6 size-4" />
      </Link>
    </section>
  );
};
