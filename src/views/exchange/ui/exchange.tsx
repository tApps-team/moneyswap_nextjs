import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta, getSeoTexts } from "@/shared/api";
import { ExchangerMarker, directions, pageTypes } from "@/shared/types";

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

  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });
  const location = city ? await getSpecificCity({ codeName: city }) : undefined;
  console.log(giveCurrency, "giveCurrecny", getCurrency, "Get");
  if (!giveCurrency.code_name || !getCurrency.code_name) {
    redirect("/");
  }
  const { status } = await getExchangers({
    valute_from: giveCurrency.code_name,
    valute_to: getCurrency.code_name,
    city: location?.code_name,
  });

  const actualCourse = await getActualCourse({
    valuteFrom: giveCurrency?.code_name,
    valuteTo: getCurrency?.code_name,
  });
  const queryParams = { valute_from, valute_to, city };
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

  // запрос на сео текста
  const seoTexts = await getSeoTexts(reqParams);
  // запрос на мета данные
  const seoMeta = await getSeoMeta(reqParams);
  await queryClient.prefetchQuery({
    queryKey: [queryParams],
    queryFn: async () => (await getExchangers(queryParams)).exchangers,
  });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrencySelectForm
        actualCourse={actualCourse}
        urlGetCurrency={{
          id: getCurrency?.name?.ru,
          code_name: getCurrency?.code_name,
          icon_url: getCurrency?.icon_url,
          name: getCurrency?.name,
        }}
        urlGiveCurrency={{
          id: giveCurrency?.name?.ru,
          code_name: giveCurrency?.code_name,
          icon_url: giveCurrency?.icon_url,
          name: giveCurrency?.name,
        }}
        urlDirection={direction}
        urlLocation={location}
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
          location={location}
        />
      ) : (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExchangersTable columns={columns} params={queryParams} />
        </HydrationBoundary>
      )}

      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={direction} />
    </section>
  );
};
