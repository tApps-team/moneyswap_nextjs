import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { getActualCourse, getAvailableValutes, getSpecificValute } from "@/entities/currency";
import { getExchangerList } from "@/entities/exchanger";
import { getCountries } from "@/entities/location";
import { BtcIcon, CardIcon, EmptyWalletIcon, SearchIcon, TelegramIcon } from "@/shared/assets";
import { products } from "@/shared/router";
import { SegmentMarker } from "@/shared/types";

export const revalidate = 10;

const CryptoTable = dynamic(
  () => import("@/widgets/crypto-exchangers/crypto-table").then((mod) => mod.CryptoTable),
  {
    suspense: true,
  },
);
export const CryptoExchangersPage = async () => {
  // Выполняем все запросы параллельно
  const [giveCurrency, getCurrency, actualCourse, cryptoExchangers, countries, giveCurrencies, getCurrencies] = await Promise.all([
    getSpecificValute({ codeName: "BTC" }),
    getSpecificValute({ codeName: "SBERRUB" }),
    getActualCourse({ valuteFrom: "BTC", valuteTo: "SBERRUB" }),
    getExchangerList(),
    getCountries(),
    getAvailableValutes({
      base: "all",
      city: undefined,
    }),
    getAvailableValutes({
      base: "BTC",
      city: undefined,
    }),
  ]);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <div className="grid grid-flow-row gap-7">
        <h1 className="unbounded_font text-yellow-main uppercase xl:text-3xl mobile-xl:text-2xl text-base font-semibold grid grid-flow-row gap-2 md:justify-items-center md:justify-center justify-start justify-items-start">
          <span className="leading-none">Список</span>
          <span className="leading-none">Всех обменных пунктов</span>
        </h1>
        <div className="xl:max-w-[60%] max-w-[80%] mx-auto md:block hidden">
          <h2 className="text-base text-center font-normal">
            На этой странице представлен список проверенных обменников, которые входят в
            рейтинг мониторинга MoneySwap. 
          </h2>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4 items-stretch justify-center mx-auto xl:max-w-[60%] max-w-[80%]">
          <div className="xl:text-base text-sm font-normal text-center xl:px-8 px-5 py-5 rounded-[15px] border-[1px] border-[#F6FF5F]/20">
            Каждый из обменников прошёл тщательную проверку и соответствует нашим стандартам
            надёжности. 
          </div>
          <div className="xl:text-base text-sm font-normal text-center xl:px-8 px-5 py-5 rounded-[15px] border-[1px] border-[#F6FF5F]/20">
            Просто выберите, какую валюту хотите отдать, и какую получить — система подберёт
            оптимальные варианты.
          </div>
        </div>
        <Link
          href={products.telegram_bot}
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden mobile-xl:grid grid-flow-col md:gap-4 gap-3 justify-center items-center justify-items-center md:mx-auto mx-0 w-fit relative z-1 cursor-pointer bg-[#039BE5] rounded-[10px] md:py-3 md:px-4 py-2 px-3 hover:scale-[1.025] duration-300 active:scale-[0.99]`}
        >
          <div className="relative bg-[#039BE5] xl:h-10 xl:w-10 mobile-xl:h-8 mobile-xl:w-8 h-6 w-6 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center cursor-pointer rounded-full border-white border-[1px]">
            <TelegramIcon className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[54%] md:size-6 size-4" />
          </div>
          <div className="uppercase font-normal xl:text-sm mobile:text-xs text-2xs leading-snug">
            <p className={`md:text-center text-start truncate`}>Больше функций доступно</p>
            <p className={`md:text-center text-start truncate`}>В нашем телеграм-боте</p>
          </div>
        </Link>
      </div>
      <CurrencySelectForm
        urlDirection={SegmentMarker.no_cash}
        actualCourse={actualCourse}
        urlGetCurrency={getCurrency}
        urlGiveCurrency={giveCurrency}
        countries={countries}
        giveCurrencies={giveCurrencies}
        getCurrencies={getCurrencies}
      />
      <Suspense fallback={<div>loading</div>}>
        <CryptoTable data={cryptoExchangers} />
      </Suspense>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-5">
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <BtcIcon className="size-[45px]" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Что такое криптообменник?
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <span>
              Криптообменник — это сервис, где вы можете обменять криптовалюту на фиатные деньги или
              другие цифровые активы. Существуют онлайн и офлайн обменники: первые удобны для
              быстрого обмена, а вторые позволяют получить наличные.
            </span>
            <span>
              Комиссия обменника может быть включена в курс или взиматься дополнительно. Регистрация
              и верификация в таких сервисах зачастую не требуется, что делает их удобным
              инструментом для быстрого обмена.
            </span>
          </div>
        </div>
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <SearchIcon className="size-[45px]" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            На MoneySwap вы найдете:
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <div className="grid grid-flow-row gap-5">
              <span>1. Обменники для популярных валют: USDT, BTC, ETH.</span>
              <span>2. Онлайн и офлайн обменные пункты в более чем 80 странах.</span>
              <span>3. Курсы обмена, основанные на лидирующих биржах.</span>
            </div>
            <span>
              Наша цель — сделать процесс обмена простым, быстрым и надёжным для всех пользователей.
            </span>
          </div>
        </div>
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <CardIcon className="size-[45px]" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Как формируются курсы обмена?
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <span>Курсы обменников на MoneySwap ориентируются на лидеров рынка:</span>
            <div className="grid grid-flow-row gap-5">
              <span>
                1. Обмен криптовалюты на фиат (например, USDT на рубли) основывается на курсах
                p2p-бирж.
              </span>
              <span>
                2. Для обменов криптовалют между собой (например, USDT на BTC) используются данные
                крупных спотовых бирж, таких как Binance, HTX и Bybit.
              </span>
            </div>
            <span>
              Мы предоставляем актуальные данные, чтобы вы могли найти выгодный вариант обмена.
            </span>
          </div>
        </div>
        <div className="lg:grid grid-cols-[0.5fr,1fr] gap-5 hidden lg:col-span-3 bg-new-dark-grey rounded-[15px] p-10">
          <div className="grid grid-flow-row content-between items-stretch">
            <p className="text-xl text-yellow-main font-bold uppercase">
              Как найти самый выгодный обменник?
            </p>
            <div className="size-[45px]">
              <EmptyWalletIcon className="size-[45px]" />
            </div>
          </div>
          <div className="grid grid-flow-row gap-5 text-base text-font-light-grey font-medium">
            <span>
              Лучший курс зависит от ваших потребностей и текущей рыночной ситуации. Чтобы найти
              выгодное предложение:
            </span>
            <div className="grid grid-flow-row gap-5">
              <span>1. Выберите валюты для обмена в калькуляторе MoneySwap.</span>
              <span>2. Система автоматически отсортирует обменники по самому выгодному курсу.</span>
            </div>
            <span>MoneySwap делает поиск надёжного и удобного обменника простым и понятным!</span>
          </div>
        </div>
        <div className="lg:hidden bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start lg:col-span-3">
          <div className="mobile-xl:block hidden size-[45px]">
            <EmptyWalletIcon className="size-[45px]" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Как найти самый выгодный обменник?
          </p>
          <div className="grid grid-flow-row lg:content-normal content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium">
            <span>
              Лучший курс зависит от ваших потребностей и текущей рыночной ситуации. Чтобы найти
              выгодное предложение:
            </span>
            <div className="grid grid-flow-row gap-5">
              <span>1. Выберите валюты для обмена в калькуляторе MoneySwap.</span>
              <span>2. Система автоматически отсортирует обменники по самому выгодному курсу.</span>
            </div>
            <span>MoneySwap делает поиск надёжного и удобного обменника простым и понятным!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
