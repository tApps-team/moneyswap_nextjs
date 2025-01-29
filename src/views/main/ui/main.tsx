import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { ExchangerMarker, pageTypes } from "@/shared/types";

const CurrencySelectForm = dynamic(() =>
  import("@/widgets/currency-select-form").then((mod) => mod.CurrencySelectForm),
);
const ExchangersTable = dynamic(() =>
  import("@/widgets/exchangers/exchangers-table/ui/exchangers-table").then(
    (mod) => mod.ExchangersTable,
  ),
);
export const Main = async ({
  searchParams,
}: {
  searchParams?: Promise<{ direction?: ExchangerMarker; city?: string }>;
}) => {
  const queryClient = new QueryClient();

  const city = (await searchParams)?.city;
  const currentDirection = (await searchParams)?.direction;

  const directionCash = !!city || currentDirection === ExchangerMarker.cash;
  const direction = directionCash ? ExchangerMarker.cash : ExchangerMarker.no_cash;

  const [seoTexts, giveCurrency, getCurrency, actualCourse, location] = await Promise.all([
    getSeoTexts({ page: pageTypes.main }),
    getSpecificValute({
      codeName: direction === ExchangerMarker.cash ? "cashrub" : "btc",
    }),
    getSpecificValute({
      codeName: direction === ExchangerMarker.cash ? "btc" : "sberrub",
    }),
    getActualCourse({ valuteFrom: "btc", valuteTo: "sberrub" }),
    getSpecificCity({ codeName: city ? city : "msk" }),
  ]);

  const request =
    direction === ExchangerMarker.cash
      ? {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
          city: location.code_name,
        }
      : {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
        };

  await queryClient.prefetchQuery({
    queryKey: [request],
    queryFn: async () => (await getExchangers(request)).exchangers,
  });

  const { status } = await getExchangers(request);

  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />

      <CurrencySelectForm
        actualCourse={actualCourse}
        urlLocation={location}
        urlGetCurrency={getCurrency}
        urlGiveCurrency={giveCurrency}
        urlDirection={direction}
      />

      {status === 404 ? (
        <EmptyListExchangers
          valuteFrom={giveCurrency}
          valuteTo={getCurrency}
          location={location ? location : undefined}
        />
      ) : (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExchangersTable cityName={location.name.ru} columns={columns} params={request} />
        </HydrationBoundary>
      )}

      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={direction} />
    </section>
  );
};
