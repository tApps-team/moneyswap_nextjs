import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CryptoSeoText } from "@/widgets/crypto-exchangers/crypto-seo-text";
// import { CryptoTable } from "@/widgets/crypto-exchangers/crypto-table";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangerList } from "@/entities/exchanger";
import { getCryptoExchangersPage } from "@/entities/strapi";
import { ExchangerMarker, directions } from "@/shared/types";
const CryptoTable = dynamic(
  () => import("@/widgets/crypto-exchangers/crypto-table").then((mod) => mod.default),
  {
    suspense: true,
  },
);
export const CryptoExchangersPage = async ({ params }: { params: { exchanger: string[] } }) => {
  const giveCurrency = await getSpecificValute({
    codeName: "BTC",
  });
  const getCurrency = await getSpecificValute({
    codeName: "SBERRUB",
  });
  const actualCourse = await getActualCourse({ valuteFrom: "BTC", valuteTo: "SBERRUB" });

  // strapi texts
  const { data } = await getCryptoExchangersPage();
  const { title, header_description, footer_description } = data;
  const cryptoExchangers = await getExchangerList();
  return (
    <div>
      <h1 className="uppercase text-3xl font-medium">{title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: header_description }}
        className="strapi_styles mt-8"
      />
      <BotBanner />
      <CurrencySelectForm
        urlDirection={ExchangerMarker.no_cash}
        actualCourse={actualCourse}
        urlGetCurrency={{
          code_name: getCurrency.code_name,
          icon_url: getCurrency.icon_url,
          id: getCurrency.name.ru,
          name: getCurrency.name,
        }}
        urlGiveCurrency={{
          code_name: giveCurrency.code_name,
          icon_url: giveCurrency.icon_url,
          id: giveCurrency.name.ru,
          name: giveCurrency.name,
        }}
      />
      <Suspense fallback={<div>loading</div>}>
        <CryptoTable data={cryptoExchangers} />
      </Suspense>
      <div
        dangerouslySetInnerHTML={{ __html: footer_description }}
        className="strapi_styles mt-8"
      />
    </div>
  );
};
