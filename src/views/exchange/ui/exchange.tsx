import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { EmptyListExchangers } from "@/widgets/exchangers/empty-list-exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { BotBanner } from "@/features/bot-banner";
import { getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta, getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const ExchangePage = async ({ params }: { params: { slug: string[] } }) => {
  const slug = params.slug[0];
  const city = params.slug[1];

  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());

  const { exchangers, status } = await getExchangers({ valute_from, valute_to, city });

  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });

  const location = city ? await getSpecificCity({ codeName: city }) : null;
  const currentDirection = city ? directions.cash : directions.noncash;
  console.log(status);
  const reqParams =
    currentDirection === directions.cash
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

  return (
    <div>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrencySelectForm
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
        urlDirection={currentDirection}
        urlLocation={{
          cityCodeName: location?.code_name!,
          cityName: location?.name?.ru!,
          countryIconUrl: location?.country.icon_url!,
          countryName: location?.country.name.ru!,
          id: location?.id!,
        }}
      />
      {status === 404 ? (
        <EmptyListExchangers
          valuteFrom={valute_from}
          valuteTo={valute_to}
          city={city ? city : undefined}
        />
      ) : (
        <ExchangersTable columns={columns} data={exchangers} />
      )}

      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={currentDirection} />
    </div>
  );
};
