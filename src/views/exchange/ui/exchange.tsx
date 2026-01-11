import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cache } from 'react';
import { AllCurrencies } from "@/widgets/all-currencies";
import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { ExchangersTableSkeleton } from "@/widgets/exchangers/exchangers-table/ui/exchangers-table-skeleton";
import { MainFAQ } from "@/widgets/main-faq";
import { SimilarCities } from "@/widgets/similar-cities";
import { SeoFooterText, SeoHeaderText, SkeletonSeoHeaderText } from "@/widgets/strapi";
import { CurrencyTitle } from "@/features/currency";
import { TopExchangeSale } from "@/features/top-exchange";
import { getActualCourse, getAvailableValutes, getSpecificValute } from "@/entities/currency";
import { increaseDirectionCount } from "@/entities/direction";
import { getExchangers } from "@/entities/exchanger";
import { getCountries, getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { pageTypes, SegmentMarker } from "@/shared/types";

// Кэшируем получение начальных данных
const getExchangeInitialData = cache(async (valute_from: string, valute_to: string, city?: string) => {
  console.time('Первая группа запросов');
  const [giveCurrency, getCurrency, location] = await Promise.all([
    getSpecificValute({ codeName: valute_from }),
    getSpecificValute({ codeName: valute_to }),
    city ? getSpecificCity({ codeName: city }) : Promise.resolve(undefined),
  ]);
  console.timeEnd('Первая группа запросов');

  return { giveCurrency, getCurrency, location };
});

const CurrencySelectForm = dynamic(() =>
  import("@/widgets/currency-select-form").then((mod) => mod.CurrencySelectForm),
);
const ExchangersTable = dynamic(() =>
  import("@/widgets/exchangers/exchangers-table/ui/exchangers-table").then(
    (mod) => mod.ExchangersTable,
  ),
);

export const ExchangePage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { city?: string; direction?: string };
}) => {
  const queryClient = new QueryClient();
  const slug = params.slug[0];
  const currentDirection = searchParams?.direction === "cash" ? SegmentMarker.cash : SegmentMarker.no_cash;
  const city = searchParams?.city;

  const directionCash = !!city || currentDirection === SegmentMarker.cash;
  const direction = directionCash ? SegmentMarker.cash : SegmentMarker.no_cash;
  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());

  // Используем кэшированную функцию для получения данных
  const { giveCurrency, getCurrency, location } = await getExchangeInitialData(valute_from, valute_to, city);

  if (!giveCurrency.code_name || !getCurrency.code_name) {
    return notFound();
  }

  const reqParams = location
    ? {
        page: pageTypes.exchange_cash,
        giveCurrency: `${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`,
        getCurrency: `${getCurrency?.name?.ru} (${getCurrency?.code_name})`,
        city: location?.name?.ru,
        country: location?.country?.name?.ru,
      }
    : {
        page: pageTypes.exchange_noncash,
        giveCurrency: `${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`,
        getCurrency: `${getCurrency?.name?.ru} (${getCurrency?.code_name})`,
      };

  // Параллельные запросы для получения обменников, курса и данных для формы
  const [exchangersResponse, actualCourse, seoTexts, countries, giveCurrencies, getCurrencies] = await Promise.all([
    getExchangers({
      valute_from: giveCurrency.code_name,
      valute_to: getCurrency.code_name,
      city: location?.code_name,
    }),
    getActualCourse({
      valuteFrom: giveCurrency.code_name,
      valuteTo: getCurrency.code_name,
    }),
    getSeoTexts(reqParams),
    getCountries(),
    getAvailableValutes({
      base: "all",
      city: direction === SegmentMarker.cash ? location?.code_name : undefined,
    }),
    getAvailableValutes({
      base: giveCurrency?.code_name,
      city: direction === SegmentMarker.cash ? location?.code_name : undefined,
    }),
  ]);

  const { status } = exchangersResponse;
  const queryParams = { valute_from, valute_to, city };

  await queryClient.prefetchQuery({
    queryKey: [queryParams],
    queryFn: async () => exchangersResponse.exchangers,
  });

  return (
    <section>
      <Suspense fallback={<SkeletonSeoHeaderText />}>
        <SeoHeaderText
          data={seoTexts.data}
          giveCurrency={`${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`}
          getCurrency={`${getCurrency?.name?.ru} (${getCurrency?.code_name})`}
          location={location && `${location?.name?.ru}, ${location?.country?.name?.ru}`}
          isExchange
        />
      </Suspense>
      <Suspense fallback={<SkeletonCurrencySelectForm />}>
        <CurrencySelectForm
          actualCourse={actualCourse}
          urlGetCurrency={getCurrency}
          urlGiveCurrency={giveCurrency}
          urlDirection={direction}
          urlLocation={location}
          countries={countries}
          giveCurrencies={giveCurrencies}
          getCurrencies={getCurrencies}
        />
      </Suspense>
      <CurrencyTitle give={giveCurrency?.name?.ru} get={getCurrency?.name?.ru} />
      <Suspense fallback={<ExchangersTableSkeleton />}>
        {status === 404 ? (
          <EmptyListExchangers valuteFrom={giveCurrency} valuteTo={getCurrency} location={location} />
        ) : (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ExchangersTable cityName={location?.name?.ru} columns={columns} params={queryParams} />
          </HydrationBoundary>
        )}
      </Suspense>

      <Suspense>
        <SeoFooterText
          data={seoTexts.data}
          isExchange
          giveCurrency={`${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`}
          getCurrency={`${getCurrency?.name?.ru} (${getCurrency?.code_name})`}
          location={city && `${location?.name?.ru}, ${location?.country?.name?.ru}`}
        />
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
          <SimilarCities city={location?.code_name} valute_from={giveCurrency?.code_name} valute_to={getCurrency?.code_name} />
        </Suspense>
      )}
    </section>
  );
};
