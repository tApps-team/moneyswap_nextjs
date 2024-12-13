import { TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBannerSidebar = () => {
  return (
    <section className="grid grid-flow-row gap-4 justify-center items-center w-full px-10 py-6 bg-dark-gray shadow-[1px_2px_8px_3px_rgba(0,0,0,0.5)] rounded-3xl">
      <p className="uppercase mobile-xl:font-medium font-medium mobile:text-xs text-2xs text-center">
        Переходи в наш бот, чтобы сделать обмен стало ещё проще и удобнее
      </p>
      <a
        className="bg-[#27aed6] rounded-[50px] grid grid-flow-col p-4 mobile-xl:p-0 gap-2 justify-center items-center mobile-xl:h-[70px]  hover:scale-[1.01] hover:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.3)] active:scale-[0.995] active:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.4)] transition-all duration-300"
        href={products.telegram_bot}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-white mobile-xl:text-sm text-2xs uppercase font-medium">
          moneyswap_robot
        </p>
        <TelegramIcon className="mobile-xl:size-6 size-4" />
      </a>
    </section>
  );
};
