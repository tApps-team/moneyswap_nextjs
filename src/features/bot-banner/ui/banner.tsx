import { ArrowRightLineIcon, TelegramIcon } from "@/shared/assets";

export const BotBanner = () => {
  return (
    <section className="text-[#bbb] grid grid-cols-2 gap-10 items-center justify-center mx-12 py-[50px]">
      <div className="grid grid-flow-col gap-20">
        <div className="text-lg uppercase grid grid-flow-row gap-2 content-between font-semibold">
          <p>Больше функций доступно</p>
          <p>В нашем телеграм-боте</p>
        </div>
        <ArrowRightLineIcon width={60} height={60} className="self-center" />
      </div>
      <div className="grid grid-cols-2 gap-8 justify-between">
        <div className="uppercase font-medium text-sm leading-5">
          <p>Переходи в наш бот,</p>
          <p>чтобы сделать обмен</p>
          <p>стало ещё проще</p>
          <p>и удобнее</p>
        </div>
        <a
          className="bg-[#27aed6] rounded-[50px] grid grid-flow-col gap-2 justify-center items-center h-[70px]"
          href="https://t.me/moneyswap_robot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white text-sm uppercase font-medium">moneyswap_robot</p>
          <TelegramIcon width={24} height={24} />
        </a>
      </div>
    </section>
  );
};
