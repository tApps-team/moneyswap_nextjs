import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cache } from 'react';
import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { ExchangersTableSkeleton } from "@/widgets/exchangers/exchangers-table/ui/exchangers-table-skeleton";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText, SkeletonSeoHeaderText } from "@/widgets/strapi";
import { CurrencyTitle } from "@/features/currency";
import { TopExchangeSale } from "@/features/top-exchange";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { ExchangerMarker, pageTypes } from "@/shared/types";

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
  searchParams?: { city?: string; direction: ExchangerMarker };
}) => {
  const queryClient = new QueryClient();
  const slug = params.slug[0];
  const currentDirection = searchParams?.direction;
  const city = searchParams?.city;

  const directionCash = !!city || currentDirection === ExchangerMarker.cash;
  const direction = directionCash ? ExchangerMarker.cash : ExchangerMarker.no_cash;
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

  // Параллельные запросы для получения обменников и курса
  const [exchangersResponse, actualCourse, seoTexts] = await Promise.all([
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
        <TopExchangeSale direction={ExchangerMarker.no_cash} />
      </Suspense>
    </section>
  );
};
