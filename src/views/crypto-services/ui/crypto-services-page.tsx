import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FC, Suspense } from "react";
import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { BlacklistShelf } from "@/widgets/home/blacklist-shelf";
import { PreviewsSliderSkeleton } from "@/widgets/home/previews-slider";
import { TopExchangersSlider } from "@/widgets/home/top-exchangers-slider";
import { HubSectionsGrid } from "@/widgets/hub/sections-grid";
import { SeoFooterText } from "@/widgets/strapi";
import {
  getExchangeFormOptions,
  getExchangePair,
  resolveExchangeDirection,
} from "@/features/exchange-form";
import { getSeoTexts } from "@/shared/api";
import { SECTION_BY_KEY, SECTION_GROUPS } from "@/shared/consts";
import { routes } from "@/shared/router";
import { pageTypes, SegmentMarker } from "@/shared/types";
import { SectionHeader } from "@/shared/ui";

const CurrencySelectForm = dynamic(() =>
  import("@/widgets/currency-select-form").then((mod) => mod.CurrencySelectForm),
);

interface CryptoServicesPageProps {
  searchParams?: { direction?: string; city?: string };
}

/**
 * Хаб «Криптовалюты»: подбор обмена, проверенные обменники и чёрный список.
 *
 * Форма здесь без таблицы курсов — выбор валюты уводит на страницу направления
 * сам по себе, а кнопка под формой ведёт на витрину обмена тех, кому подходит
 * пара по умолчанию. Вкладки нал/безнал остаются на хабе (basePath), иначе
 * выбор города выбрасывал бы со страницы.
 */
export const CryptoServicesPage: FC<CryptoServicesPageProps> = async ({ searchParams }) => {
  const group = SECTION_GROUPS.find((item) => item.key === "crypto")!;
  const exchangersSection = SECTION_BY_KEY.exchangers;

  const city = searchParams?.city;
  const direction = resolveExchangeDirection(searchParams);

  const [seoTexts, { giveCurrency, getCurrency, actualCourse, location }] = await Promise.all([
    getSeoTexts({ page: pageTypes.crypto_services }),
    getExchangePair(direction, city),
  ]);

  const { countries, giveCurrencies, getCurrencies } = await getExchangeFormOptions(
    giveCurrency?.code_name,
    direction === SegmentMarker.cash ? location?.code_name : undefined,
  );

  const exchangeHref =
    direction === SegmentMarker.cash
      ? `${routes.exchange}?direction=cash${location?.code_name ? `&city=${location.code_name}` : ""}`
      : routes.exchange;

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={group.title} subtitle={group.subtitle} />

      <HubSectionsGrid group={group} />

      <div className="grid gap-4 min-w-0">
        <Suspense fallback={<SkeletonCurrencySelectForm />}>
          <CurrencySelectForm
            actualCourse={actualCourse}
            urlLocation={location || undefined}
            urlGetCurrency={getCurrency}
            urlGiveCurrency={giveCurrency}
            urlDirection={direction}
            countries={countries}
            giveCurrencies={giveCurrencies}
            getCurrencies={getCurrencies}
            basePath={routes.crypto_services}
          />
        </Suspense>

        <Link
          href={exchangeHref}
          className="group mx-auto inline-flex items-center justify-center gap-2 rounded-[10px] bg-yellow-main px-6 py-3 text-sm font-medium uppercase text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none"
        >
          Смотреть курсы обменников
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <Suspense fallback={<PreviewsSliderSkeleton />}>
        <TopExchangersSlider
          title={exchangersSection.title}
          subtitle={exchangersSection.description}
          groupHref={routes.exchangers}
          groupLabel="Все обменники"
        />
      </Suspense>

      <Suspense fallback={<PreviewsSliderSkeleton />}>
        <BlacklistShelf />
      </Suspense>

      <Suspense>
        <SeoFooterText data={seoTexts.data} />
      </Suspense>
    </section>
  );
};
