import { ArrowRightLineIcon, TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBanner = () => {
  return (
    <section className="text-light-gray grid mobile:grid-cols-2 mobile-xs:grid-cols-[1fr_0.7fr] grid-cols-[1fr_0.5fr] mobile-xl:gap-10 gap-0 items-center justify-center mobile-xl:mx-12 py-7 mobile-xl:py-[50px]">
      <div className="grid grid-flow-col gap-20">
        <div className="mobile-xl:text-lg mobile:text-2xs text-[8.5px] uppercase grid grid-flow-row gap-2 content-between mobile-xl:font-semibold mobile:font-medium font-semibold">
          <p>
            Больше функций <span className="mobile-xs:inline hidden">доступно</span>
          </p>
          <p>
            В <span className="mobile-xs:inline hidden">нашем</span> телеграм-боте
          </p>
        </div>
        <ArrowRightLineIcon
          width={60}
          height={60}
          className="self-center hidden mobile-xl:block fill-none stroke-[#b9b9b9] stroke-2 "
        />
      </div>
      <div className="grid mobile-xl:grid-cols-2 gap-8 mobile-xl:justify-between justify-stretch">
        <div className="uppercase hidden mobile-xl:block font-medium text-sm leading-5">
          <p>Переходи в наш бот,</p>
          <p>чтобы сделать обмен</p>
          <p>стало ещё проще</p>
          <p>и удобнее</p>
        </div>
        <a
          className="bg-[#27aed6] rounded-full min-w-40 grid grid-flow-col mobile-xl:gap-2 gap-1 justify-center items-center mobile-xl:h-[70px] mobile:h-[56px] h-[44px] hover:scale-[1.01] hover:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.3)] active:scale-[0.995] active:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.4)] transition-all duration-300"
          href={products.telegram_bot}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white mobile-xl:text-sm mobile:text-2xs text-3xs uppercase mobile-xl:font-medium font-semibold">
            moneyswap_robot
          </p>
          <TelegramIcon className="mobile-xl:size-6 size-4" />
        </a>
      </div>
    </section>
  );
};
