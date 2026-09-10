import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AllCurrencies } from "@/widgets/all-currencies";
import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangeTop } from "@/widgets/exchange-top";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { ExchangersTableSkeleton } from "@/widgets/exchangers/exchangers-table";
import { MainFAQ } from "@/widgets/main-faq";
import { SimilarCities } from "@/widgets/similar-cities";
import { SeoFooterText } from "@/widgets/strapi";
import { CurrencyTitle } from "@/features/currency";
import {
  getExchangeFormOptions,
  getExchangePair,
  resolveExchangeDirection,
} from "@/features/exchange-form";
import { TopExchangeSale } from "@/features/top-exchange";
import { getExchangers } from "@/entities/exchanger";
import { getSeoTexts } from "@/shared/api";
import { pageTypes, SegmentMarker } from "@/shared/types";

const CurrencySelectForm = dynamic(() =>
  import("@/widgets/currency-select-form").then((mod) => mod.CurrencySelectForm),
);
const ExchangersTable = dynamic(() =>
  import("@/widgets/exchangers/exchangers-table/ui/exchangers-table").then(
    (mod) => mod.ExchangersTable,
  ),
);

/**
 * Витрина обмена по адресу /exchange — то, что раньше было главной страницей.
 * Пара по умолчанию SBERRUB→BTC, при ?direction=cash — CASHRUB→BTC.
 */
export const ExchangeRootPage = async ({
  searchParams,
}: {
  searchParams?: { direction?: string; city?: string };
}) => {
  const queryClient = new QueryClient();

  const city = searchParams?.city;
  const direction = resolveExchangeDirection(searchParams);

  const [seoTexts, { giveCurrency, getCurrency, actualCourse, location }] = await Promise.all([
    getSeoTexts({ page: pageTypes.main }),
    getExchangePair(direction, city),
  ]);

  const request =
    direction === SegmentMarker.cash && location
      ? {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
          city: location.code_name,
        }
      : {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
        };

  // Обменники и списки для селектов идут параллельно: таблица и форма
  // не зависят друг от друга
  const [exchangersResponse, { countries, giveCurrencies, getCurrencies }] = await Promise.all([
    getExchangers(request),
    getExchangeFormOptions(
      giveCurrency?.code_name,
      direction === SegmentMarker.cash ? location?.code_name : undefined,
    ),
  ]);

  queryClient.setQueryData([request], exchangersResponse.exchangers);

  return (
    <section>
      <ExchangeTop />
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
        />
      </Suspense>
      <CurrencyTitle give={giveCurrency?.name?.ru} get={getCurrency?.name?.ru} />
      <Suspense fallback={<ExchangersTableSkeleton />}>
        {exchangersResponse.status === 404 ? (
          <EmptyListExchangers
            valuteFrom={giveCurrency}
            valuteTo={getCurrency}
            location={location ? location : undefined}
          />
        ) : (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExchangersTable
              cityName={direction === SegmentMarker.cash ? location?.name?.ru : undefined}
              columns={columns}
              params={request}
            />
          </HydrationBoundary>
        )}
      </Suspense>

      <Suspense>
        <SeoFooterText data={seoTexts.data} />
      </Suspense>
      <Suspense>
        <MainFAQ direction={direction} />
      </Suspense>
      <Suspense>
        <AllCurrencies />
      </Suspense>
      <Suspense>
        <TopExchangeSale direction={direction} />
      </Suspense>
      {location && (
        <Suspense>
          <SimilarCities
            city={location?.code_name}
            valute_from={giveCurrency?.code_name}
            valute_to={getCurrency?.code_name}
          />
        </Suspense>
      )}
    </section>
  );
};
