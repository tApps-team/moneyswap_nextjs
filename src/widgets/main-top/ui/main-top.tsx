import Image from "next/image";

export const MainTop = () => {
  return (
    <section className="relative lg:pt-0 mobile-xl:pt-6 pt-0 lg:pb-[60px] mobile-xl:pb-[80px] pb-0 mobile-xl:mb-0 mb-5">
      <div className="grid mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start gap-5">
        <p className="sr-only text-base font-light text-white">В поисках надежных обменников?</p>
        <h1 className="grid lg:grid-flow-row uppercase mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start">
          <span className="lg:block hidden unbounded_font leading-normal xl:text-[34px] text-[28px] text-yellow-main font-bold">
            Мониторинг Криптообменников
          </span>
          <span className="lg:hidden unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            Мониторинг
          </span>
          <span className="lg:hidden unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            Криптообменников
          </span>
          <span className="unbounded_font md:leading-normal leading-tight xl:text-[36px] text-[32px] md:text-2xl mobile-xl:text-xl text-sm  text-white font-medium lg:mt-0 mt-2">
            MoneySwap
          </span>
        </h1>
        <p className="lg:block hidden text-[15px] font-light text-white w-[60vw] max-w-[780px] text-center">
          MoneySwap — агрегатор криптообменников, ваш помощник в обмене, покупке и продаже
          криптовалют, электронных денег, наличных.
        </p>
      </div>
      <div className="mobile-xl:block hidden absolute w-full h-full -top-10 left-0 bg-[url(/redesign/main_ellipse.png)] bg-contain bg-no-repeat bg-center"></div>
      <div className="absolute w-full h-[calc(100%_+_80px)] -top-6 left-0 lg:bg-[url(/redesign/main_currencies_new.png)] bg-transparent bg-contain bg-no-repeat bg-center"></div>
    </section>
  );
};
