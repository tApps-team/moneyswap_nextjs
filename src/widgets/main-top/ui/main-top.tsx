import Image from "next/image";

export const MainTop = () => {
  return (
    <section className="relative pt-10 pb-[120px] lg:bg-[url(/redesign/main_currencies.png)] bg-transparent bg-contain bg-no-repeat bg-center">
      <div className="grid justify-center justify-items-center gap-12">
        <p className="lg:block hidden text-base font-light text-white">
          В поисках надежных обменников?
        </p>
        <h1 className="grid uppercase justify-center justify-items-center">
          <span className="leading-tight lg:text-[44px] md:text-[30px] text-yellow-main font-bold">
            Мониторинг
          </span>
          <span className="leading-tight lg:text-[44px] md:text-[30px] text-yellow-main font-bold">
            Криптообменников
          </span>
          <span className="leading-tight lg:text-[36px] md:text-2xl text-white font-medium mt-6">
            MoneySwap
          </span>
        </h1>
        <p className="lg:block hidden text-base font-light text-white w-[70vw] max-w-[980px] text-center">
          MoneySwap — агрегатор криптообменников, ваш помощник в обмене, покупке и продаже
          криптовалют, электронных денег, наличных.
        </p>
      </div>
      <div className="absolute w-full h-full -top-10 left-0 bg-[url(/redesign/main_ellipse.png)] bg-contain bg-no-repeat bg-center"></div>
    </section>
  );
};
