import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { cache } from 'react';
import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { ExchangersTableSkeleton } from "@/widgets/exchangers/exchangers-table";
import { MainFAQ } from "@/widgets/main-faq";
import { MainTop } from "@/widgets/main-top";
import { SeoFooterText, SkeletonSeoHeaderText } from "@/widgets/strapi";
import { BotBannerNew, SkeletonBotBannerNew } from "@/features/bot-banner";
import { CurrencyTitle } from "@/features/currency";
import { TopExchangeSale } from "@/features/top-exchange";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
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

// Кэшируем получение начальных данных
const getInitialData = cache(async (direction: Omit<SegmentMarker, SegmentMarker.both>, city?: string) => {
  const [seoTexts, giveCurrency, getCurrency, actualCourse, location] = await Promise.all([
    getSeoTexts({ page: pageTypes.main }),
    getSpecificValute({
      codeName: direction === SegmentMarker.cash ? "cashrub" : "sberrub",
    }),
    getSpecificValute({
      codeName: "btc",
    }),
    getActualCourse({ 
      valuteFrom: direction === SegmentMarker.cash ? "cashrub" : "sberrub", 
      valuteTo: "btc" 
    }),
    getSpecificCity({ codeName: city ? city : "msk" }),
  ]);

  return { seoTexts, giveCurrency, getCurrency, actualCourse, location };
});

export const Main = async ({
  searchParams,
}: {
  searchParams?: { direction?: string; city?: string };
}) => {
  const queryClient = new QueryClient();

  const city = searchParams?.city;
  const currentDirection = searchParams?.direction === "cash" ? SegmentMarker.cash : SegmentMarker.no_cash;

  const directionCash = !!city || currentDirection === SegmentMarker.cash;
  const direction = directionCash ? SegmentMarker.cash : SegmentMarker.no_cash;

  // Используем кэшированную функцию для получения начальных данных
  const { seoTexts, giveCurrency, getCurrency, actualCourse, location } = await getInitialData(direction, city);

  // Формируем параметры запроса обменников
  const request = direction === SegmentMarker.cash
    ? {
        valute_from: giveCurrency?.code_name,
        valute_to: getCurrency?.code_name,
        city: location.code_name,
      }
    : {
        valute_from: giveCurrency?.code_name,
        valute_to: getCurrency?.code_name,
      };

  // Получаем данные обменников
  const exchangersResponse = await getExchangers(request);
  queryClient.setQueryData([request], exchangersResponse.exchangers);

  return (
    <section>
      <Suspense>
        <MainTop />
      </Suspense>
      <div className="lg:-mt-8 -mt-14 mobile-xl:block hidden lg:mb-[65px] mobile-xl:mb-10">
        <Suspense fallback={<SkeletonBotBannerNew />}>
          <BotBannerNew />
        </Suspense>
      </div>
      <Suspense fallback={<SkeletonCurrencySelectForm />}>
        <CurrencySelectForm
          actualCourse={actualCourse}
          urlLocation={location}
          urlGetCurrency={getCurrency}
          urlGiveCurrency={giveCurrency}
          urlDirection={direction}
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
        <TopExchangeSale direction={SegmentMarker.no_cash} />
      </Suspense>
    </section>
  );
};
