import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { ExchangerMarker, pageTypes } from "@/shared/types";

export const Main = async ({
  searchParams,
}: {
  searchParams?: { direction?: ExchangerMarker; city?: string };
}) => {
  const queryClient = new QueryClient();

  const city = searchParams?.city;
  const currentDirection = searchParams?.direction;

  const directionCash = !!city || currentDirection === ExchangerMarker.cash;
  const direction = directionCash ? ExchangerMarker.cash : ExchangerMarker.no_cash;
  const seoTexts = await getSeoTexts({ page: pageTypes.main });
  const giveCurrency = await getSpecificValute({
    codeName: direction === ExchangerMarker.cash ? "cashrub" : "btc",
  });
  const getCurrency = await getSpecificValute({
    codeName: direction === ExchangerMarker.cash ? "btc" : "sberrub",
  });
  const actualCourse = await getActualCourse({ valuteFrom: "btc", valuteTo: "sberrub" });
  const location = await getSpecificCity({ codeName: city ? city : "msk" });

  const request = location
    ? {
        valute_from: giveCurrency?.code_name,
        valute_to: getCurrency?.code_name,
        city: location.code_name,
      }
    : {
        valute_from: giveCurrency?.code_name,
        valute_to: getCurrency?.code_name,
      };

  // await queryClient.prefetchQuery({
  //   queryKey: ["exchangers"],
  //   queryFn: () => getExchangersTest(request),
  // });
  const { exchangers, status } = await getExchangers(request);

  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrencySelectForm
        actualCourse={actualCourse}
        urlLocation={location}
        urlGetCurrency={{
          code_name: getCurrency.code_name,
          icon_url: getCurrency.icon_url,
          id: getCurrency.name.ru,
          name: getCurrency.name,
        }}
        urlDirection={direction}
        urlGiveCurrency={{
          code_name: giveCurrency.code_name,
          icon_url: giveCurrency.icon_url,
          id: giveCurrency.name.ru,
          name: giveCurrency.name,
        }}
      />
      {status === 404 ? (
        <EmptyListExchangers
          valuteFrom={{
            code_name: giveCurrency.code_name,
            icon_url: giveCurrency.icon_url,
            id: giveCurrency.name.ru,
            name: giveCurrency.name,
          }}
          valuteTo={{
            code_name: getCurrency.code_name,
            icon_url: getCurrency.icon_url,
            id: getCurrency.name.ru,
            name: getCurrency.name,
          }}
          location={location ? location : undefined}
        />
      ) : (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExchangersTable columns={columns} data={exchangers || []} />
        </HydrationBoundary>
      )}

      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={direction} />
    </section>
  );
};
