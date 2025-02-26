import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { MainTop } from "@/widgets/main-top";
import { SeoFooterText } from "@/widgets/strapi";
import { BotBannerNew } from "@/features/bot-banner";
import { CurrencyTitle } from "@/features/currency";
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
      <MainTop />
      <div className="-mt-14 mobile-xl:block hidden lg:mb-[65px] mobile-xl:mb-10">
        <BotBannerNew />
      </div>
      <CurrencySelectForm
        actualCourse={actualCourse}
        urlLocation={location}
        urlGetCurrency={getCurrency}
        urlGiveCurrency={giveCurrency}
        urlDirection={direction}
      />
      <CurrencyTitle give={giveCurrency?.name?.ru} get={getCurrency?.name?.ru} />
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
