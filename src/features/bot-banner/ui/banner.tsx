import { ArrowRightLineIcon, TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const BotBanner = () => {
  return (
    <section className="text-light-gray grid xl:grid-cols-2 md:grid-cols-[0.9fr_1fr] mobile-xl:grid-cols-[1fr_0.3fr] mobile:grid-cols-2 mobile-xs:grid-cols-[1fr_0.7fr] grid-cols-[1fr_0.5fr] md:gap-6 xl:gap-10 gap-0 items-center justify-center xl:mx-12 py-7 md:py-[50px]">
      <div className="grid grid-flow-col lg:gap-20 md:gap-8 mobile-xl:gap-0 gap-6 mobile-xl:items-center md:items-stretch">
        <div className="xl:text-lg lg:text-sm md:text-xs mobile:text-2xs text-[8.5px] uppercase grid grid-flow-row gap-2 md:content-between content-around mobile-xl:font-medium mobile:font-medium font-medium [&>svg]:w-[50px] [&>svg]:h-[50px] md:[&>svg]:w-[60px] md:[&>svg]:h-[60px]">
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
      <div className="grid md:grid-cols-2 xl:gap-8 gap-6 mobile-xl:justify-between justify-stretch items-center">
        <div className="uppercase hidden md:block font-medium xl:text-sm lg:text-xs text-2xs lg:leading-5 leading-4">
          <p>Переходи в наш бот,</p>
          <p>чтобы сделать обмен</p>
          <p>стало ещё проще</p>
          <p>и удобнее</p>
        </div>
        <a
          className="bg-[#27aed6] rounded-full min-w-40 grid grid-flow-col mobile-xl:gap-2 gap-1 justify-center items-center lg:h-[70px] md:h-[60px] mobile:h-[56px] h-[44px] hover:scale-[1.01] hover:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.3)] active:scale-[0.995] active:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.4)] transition-all duration-300"
          href={products.telegram_bot}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white xl:text-sm lg:text-xs md:text-2xs text-3xs uppercase mobile-xl:font-medium font-medium">
            moneyswap_robot
          </p>
          <TelegramIcon className="mobile-xl:size-6 size-4" />
        </a>
      </div>
    </section>
  );
};
