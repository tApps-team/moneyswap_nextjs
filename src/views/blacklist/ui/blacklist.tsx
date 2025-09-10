import { Ban, Lightbulb, HeartHandshake } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getBlackList } from "@/entities/exchanger";
import { SearchIcon } from "@/shared/assets";

export const revalidate = 60;

const BlacklistCryptoTable = dynamic(
  () => import("@/widgets/crypto-exchangers/crypto-table").then((mod) => mod.BlacklistCryptoTable),
  {
    suspense: true,
  },
);
export const BlacklistPage = async () => {
  // Выполняем все запросы параллельно
  const [blackList] = await Promise.all([
    getBlackList(),
  ]);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <div className="grid grid-flow-row gap-7">
        <h1 className="unbounded_font text-yellow-main uppercase xl:text-3xl mobile-xl:text-2xl text-base font-semibold grid grid-flow-row gap-2">
          <span className="leading-none">Черный список</span>
          <span className="leading-none">Обменников на MoneySwap</span>
        </h1>
          <h2 className="text-base font-normal">
            Перечень обменников, сайтов, бирж, телеграм-каналов, групп, аккаунтов, которые заподозрены в совершении мошеннических действий, обмане пользователей или других незаконных действиях. 
          </h2>
      </div>
      <Suspense fallback={<div>loading</div>}>
        <BlacklistCryptoTable data={blackList} />
      </Suspense>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-5">
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <Ban className="size-[45px] text-yellow-main" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Что такое скам-обменник?
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <span>
            Скам-обменник — это сайт или сервис, который выдаёт себя за легальный обмен криптовалюты, но на самом деле создан для кражи средств.
            Такие площадки могут использовать поддельные курсы, фальшивые отзывы или копировать дизайн известных сервисов.
            </span>
            <span>
            Они могут исчезнуть сразу после получения ваших денег или тянуть время, пока вы не сможете вернуть средства.
            Важно помнить: даже красивый сайт не гарантирует честность.
            </span>
          </div>
        </div>
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <SearchIcon className="size-[45px] text-yellow-main" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Как выявить мошенника?
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <div className="grid grid-flow-row gap-5">
              <span>1. Проверяйте домен и адрес сайта — мошенники часто используют похожие имена.</span>
              <span>2. Изучайте отзывы на независимых платформах, а не только на самом сайте обменника.</span>
              <span>3. Смотрите на историю сервиса — новый сайт без репутации может быть риском.</span>
            </div>
            <span>
            Наша цель — помочь вам распознать и избежать недобросовестных обменников.
            </span>
          </div>
        </div>
        <div className="bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start">
          <div className="mobile-xl:block hidden size-[45px]">
            <Lightbulb className="size-[45px] text-yellow-main" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
            Как не попасться на мошенника?
          </p>
          <div className="grid grid-flow-row content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium lg:mt-[10px] mt-0">
            <div className="grid grid-flow-row gap-5">
              <span>
                1. Никогда не переводите деньги напрямую на личные карты незнакомцев.
              </span>
              <span>
                2. Используйте только проверенные сервисы из надёжных списков.
              </span>
              <span>3. Сравнивайте данные обменника с информацией на популярных мониторингах.</span>
            </div>
            <span>
            Мы собираем и обновляем данные, чтобы вы могли безопасно обменивать криптовалюту.
            </span>
          </div>
        </div>
        <div className="lg:grid grid-cols-[0.5fr,1fr] gap-5 hidden lg:col-span-3 bg-new-dark-grey rounded-[15px] p-10">
          <div className="grid grid-flow-row content-between items-stretch">
            <p className="text-xl text-yellow-main font-bold uppercase">
              Что делать, если стали жертвой?
            </p>
            <div className="size-[45px] text-yellow-main">
              <HeartHandshake className="size-[45px]" />
            </div>
          </div>
          <div className="grid grid-flow-row gap-5 text-base text-font-light-grey font-medium">
            <span>
            Если вы подозреваете, что стали жертвой мошенников:
            </span>
            <div className="grid grid-flow-row gap-5">
              <span>1. Сразу соберите все доказательства (скриншоты, переписку, чеки).</span>
              <span>2. Обратитесь в поддержку банка и попытайтесь отменить перевод.</span>
              <span>3. Подайте жалобу в киберполицию и предупредите других пользователей посредством обращения в поддержку MoneySwap.</span>
            </div>
            <span>Мы делаем всё, чтобы таких ситуаций было меньше, а пользователи были защищены.</span>
          </div>
        </div>
        <div className="lg:hidden bg-new-dark-grey rounded-[15px] lg:p-10 md:p-8 p-5 grid mobile-xl:grid-rows-[auto,auto,1fr] grid-rows-[auto,1fr] mobile-xl:gap-[30px] gap-5 justify-start lg:col-span-3">
          <div className="mobile-xl:block hidden size-[45px]">
            <HeartHandshake className="size-[45px] text-yellow-main" />
          </div>
          <p className="md:text-xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-bold uppercase">
          Что делать, если стали жертвой?
          </p>
          <div className="grid grid-flow-row lg:content-normal content-start mobile-xl:gap-[30px] gap-5 mobile-xl:text-base mobile:text-sm text-xs text-font-light-grey font-medium">
            <span>
            Если вы подозреваете, что стали жертвой мошенников:
            </span>
            <div className="grid grid-flow-row gap-5">
            <span>1. Сразу соберите все доказательства (скриншоты, переписку, чеки).</span>
              <span>2. Обратитесь в поддержку банка и попытайтесь отменить перевод.</span>
              <span>3. Подайте жалобу в киберполицию и предупредите других пользователей посредством обращения в поддержку MoneySwap.</span>
            </div>
            <span>Мы делаем всё, чтобы таких ситуаций было меньше, а пользователи были защищены.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
