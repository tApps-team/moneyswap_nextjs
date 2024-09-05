import { TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBannerSidebar = () => {
  return (
    <section className="grid grid-flow-row gap-4 justify-center items-center w-full px-10 py-6 bg-[#2d2d2d] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] rounded-3xl">
      <p className="uppercase font-semibold text-xs text-center">
        Переходи в наш бот, чтобы сделать обмен стало ещё проще и удобнее
      </p>
      <a
        className="bg-[#27aed6] rounded-[50px] grid grid-flow-col gap-2 justify-center items-center h-[70px] hover:scale-[1.01] hover:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.3)] active:scale-[0.995] active:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.4)] transition-all duration-300"
        href={products.telegram_bot}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-white text-sm uppercase font-medium">moneyswap_robot</p>
        <TelegramIcon width={24} height={24} />
      </a>
    </section>
  );
};
