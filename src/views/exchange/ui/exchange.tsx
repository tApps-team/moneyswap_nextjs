import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { CurrencyTitle } from "@/features/currency";
import { TopExchangeSale } from "@/features/top-exchange";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { ExchangerMarker, pageTypes } from "@/shared/types";

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

  console.time('Первая группа запросов');
  // Первая группа запросов для получения базовой информации
  const [giveCurrency, getCurrency, location] = await Promise.all([
    getSpecificValute({ codeName: valute_from }),
    getSpecificValute({ codeName: valute_to }),
    city ? getSpecificCity({ codeName: city }) : Promise.resolve(undefined),
  ]);
  console.timeEnd('Первая группа запросов');

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

  // Детальное измерение времени для каждого запроса
  console.time('Запрос обменников');
  const exchangersPromise = getExchangers({
    valute_from: giveCurrency.code_name,
    valute_to: getCurrency.code_name,
    city: location?.code_name,
  });

  console.time('Запрос курса');
  const actualCoursePromise = getActualCourse({
    valuteFrom: giveCurrency.code_name,
    valuteTo: getCurrency.code_name,
  });

  console.time('Запрос SEO текстов');
  const seoTextsPromise = getSeoTexts(reqParams);

  // Выполняем все запросы параллельно
  const [exchangersResponse, actualCourse, seoTexts] = await Promise.all([
    exchangersPromise.then(result => {
      console.timeEnd('Запрос обменников');
      return result;
    }),
    actualCoursePromise.then(result => {
      console.timeEnd('Запрос курса');
      return result;
    }),
    seoTextsPromise.then(result => {
      console.timeEnd('Запрос SEO текстов');
      return result;
    }),
  ]);

  const { status } = exchangersResponse;
  const queryParams = { valute_from, valute_to, city };

  await queryClient.prefetchQuery({
    queryKey: [queryParams],
    queryFn: async () => (await getExchangers(queryParams)).exchangers,
  });
  return (
    <section>
      <SeoHeaderText
        data={seoTexts.data}
        giveCurrency={`${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`}
        getCurrency={`${getCurrency?.name?.ru} (${getCurrency?.code_name})`}
        location={location && `${location?.name?.ru}, ${location?.country?.name?.ru}`}
        isExchange
      />
      <CurrencySelectForm
        actualCourse={actualCourse}
        urlGetCurrency={getCurrency}
        urlGiveCurrency={giveCurrency}
        urlDirection={direction}
        urlLocation={location}
      />
      <CurrencyTitle give={giveCurrency?.name?.ru} get={getCurrency?.name?.ru} />
      {status === 404 ? (
        <EmptyListExchangers valuteFrom={giveCurrency} valuteTo={getCurrency} location={location} />
      ) : (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExchangersTable cityName={location?.name?.ru} columns={columns} params={queryParams} />
        </HydrationBoundary>
      )}

      <SeoFooterText
        data={seoTexts.data}
        isExchange
        giveCurrency={`${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`}
        getCurrency={`${getCurrency?.name?.ru} (${getCurrency?.code_name})`}
        location={city && `${location?.name?.ru}, ${location?.country?.name?.ru}`}
      />
      <MainFAQ direction={direction} />
      <TopExchangeSale direction={ExchangerMarker.no_cash} />
    </section>
  );
};
