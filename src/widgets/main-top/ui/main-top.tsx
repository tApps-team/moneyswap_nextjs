import Image from "next/image";

export const MainTop = () => {
  return (
    <section className="relative mobile-xl:pt-10 pt-0 mobile-xl:pb-[120px] pb-0 lg:bg-[url(/redesign/main_currencies.png)] bg-transparent bg-contain bg-no-repeat bg-center">
      <div className="grid mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start gap-12">
        <p className="lg:block hidden text-base font-light text-white">
          В поисках надежных обменников?
        </p>
        <h1 className="grid uppercase mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start">
          <span className="md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            Мониторинг
          </span>
          <span className="md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            Криптообменников
          </span>
          <span className="md:leading-normal leading-tight lg:text-[36px] md:text-2xl mobile-xl:text-xl text-sm  text-white font-medium md:mt-6 mobile-xl:mt-4 mt-2">
            MoneySwap
          </span>
        </h1>
        <p className="lg:block hidden text-base font-light text-white w-[70vw] max-w-[980px] text-center">
          MoneySwap — агрегатор криптообменников, ваш помощник в обмене, покупке и продаже
          криптовалют, электронных денег, наличных.
        </p>
      </div>
      <div className="mobile-xl:block hidden absolute w-full h-full -top-10 left-0 bg-[url(/redesign/main_ellipse.png)] bg-contain bg-no-repeat bg-center"></div>
    </section>
  );
};
