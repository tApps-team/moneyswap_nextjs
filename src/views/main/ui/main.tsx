import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const Main = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const direction = searchParams?.direction ? directions.cash : directions.noncash;

  const seoTexts = await getSeoTexts({ page: pageTypes.main });
  const giveCurrency = await getSpecificValute({
    codeName: direction === directions.cash ? "cashrub" : "BTC",
  });
  const getCurrency = await getSpecificValute({
    codeName: direction === directions.cash ? "btc" : "SBERRUB",
  });
  const actualCourse = await getActualCourse({ valuteFrom: "BTC", valuteTo: "SBERRUB" });
  const location = await getSpecificCity({ codeName: "msk" });
  const request =
    direction === directions.cash
      ? {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
          city: location.code_name,
        }
      : {
          valute_from: giveCurrency?.code_name,
          valute_to: getCurrency?.code_name,
        };

  const { exchangers } = await getExchangers(request);

  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrencySelectForm
        actualCourse={actualCourse}
        urlLocation={{
          cityCodeName: location?.code_name,
          cityName: location?.name?.ru,
          countryIconUrl: location?.country?.icon_url,
          countryName: location?.country?.name?.ru,
          id: location?.id,
        }}
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
      <ExchangersTable columns={columns} data={exchangers || []} />
      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={direction} />
    </section>
  );
};
