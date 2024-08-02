import { CurrecnySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta, getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const ExchangePage = async ({ params }: { params: { slug: string[] } }) => {
  const slug = params.slug[0];
  const city = params.slug[1];

  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());
  console.log(params);
  const exchangers = await getExchangers({ valute_from, valute_to, city });

  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });
  const location = await getSpecificCity({ codeName: city });
  const currentDirection = city ? directions.cash : directions.noncash;
  const reqParams =
    currentDirection === directions.cash
      ? {
          page: pageTypes.exchange_cash,
          giveCurrency: `${giveCurrency?.name?.ru} ${giveCurrency?.code_name}`,
          getCurrency: `${getCurrency?.name?.ru} ${getCurrency?.code_name}`,
          city: location?.name?.ru,
          country: location?.country?.name?.ru,
        }
      : {
          page: pageTypes.exchange_noncash,
          giveCurrency: `${giveCurrency?.name?.ru} ${giveCurrency?.code_name}`,
          getCurrency: `${getCurrency?.name?.ru} ${getCurrency?.code_name}`,
        };

  // запрос на сео текста
  const seoTexts = await getSeoTexts(reqParams);
  // запрос на мета данные
  const seoMeta = await getSeoMeta(reqParams);

  return (
    <div>
      <SeoHeaderText data={seoTexts.data} />
      <CurrecnySelectForm />
      <ExchangersTable columns={columns} data={exchangers} />

      <MainFAQ />
      <SeoFooterText data={seoTexts.data} />
    </div>
  );
};
