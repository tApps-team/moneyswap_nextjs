import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/shared/router";

export const MainTop = () => {
  return (
    <section className="relative lg:pt-0 mobile-xl:pt-6 pt-0 lg:pb-[60px] mobile-xl:pb-[80px] pb-0 mobile-xl:mb-0 mb-5">
      <div className="grid mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start gap-5">
        <p className="sr-only text-base font-light text-white">
          Ищете надёжный сервис для обмена, платежей или банковских продуктов?
        </p>
        <h1 className="grid lg:grid-flow-row uppercase mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start">
          <span className="lg:block hidden unbounded_font leading-normal xl:text-[34px] text-[28px] text-yellow-main font-bold">
            Рейтинги финансовых сервисов
          </span>
          <span className="lg:hidden unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            Рейтинги
          </span>
          <span className="lg:hidden unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base text-yellow-main font-bold">
            финансовых сервисов
          </span>
          <span className="unbounded_font md:leading-normal leading-tight xl:text-[36px] text-[32px] md:text-2xl mobile-xl:text-xl text-sm text-white font-medium lg:mt-0 mt-2">
            MoneySwap
          </span>
        </h1>
        <p className="lg:block hidden text-[15px] font-light text-white w-[60vw] max-w-[780px] text-center">
          Независимые подборки MoneySwap: обменники криптовалюты, платёжные агенты ВЭД, виртуальные
          карты, eSIM, банковские карты и займы — всё проверено и собрано в одном месте.
        </p>

        <div className="relative z-10 grid mobile-xl:grid-flow-col grid-flow-row gap-3 mobile-xl:justify-center justify-items-stretch w-full mobile-xl:w-auto mt-1">
          {/* Якорь на сетку направлений: единого хаба больше нет, а выделять
              одно направление в ущерб остальным незачем */}
          <Link
            href="#sections"
            className="group inline-flex w-full mobile-xl:w-auto items-center justify-center gap-2 rounded-[10px] bg-yellow-main px-6 py-3 text-sm font-medium uppercase text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none"
          >
            Все направления
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={routes.exchange}
            className="inline-flex w-full mobile-xl:w-auto items-center justify-center rounded-[10px] border border-[#575A62] px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:border-yellow-main hover:text-yellow-main active:scale-[0.98]"
          >
            Обменять криптовалюту
          </Link>
        </div>
      </div>
      <div className="mobile-xl:block hidden absolute w-full h-full -top-10 left-0 bg-[url(/redesign/main_ellipse.png)] bg-contain bg-no-repeat bg-center"></div>
    </section>
  );
};
