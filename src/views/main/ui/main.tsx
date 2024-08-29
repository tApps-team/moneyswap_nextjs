import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { ExchangersTable, columns } from "@/widgets/exchangers";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { BotBanner } from "@/features/bot-banner";
import { getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const Main = async () => {
  const seoTexts = await getSeoTexts({ page: pageTypes.main });
  const giveCurrency = await getSpecificValute({ codeName: "BTC" });
  const getCurrency = await getSpecificValute({ codeName: "SBERRUB" });
  const { exchangers } = await getExchangers({
    valute_from: giveCurrency.code_name,
    valute_to: getCurrency.code_name,
  });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrencySelectForm
        urlGetCurrency={{
          code_name: getCurrency.code_name,
          icon_url: getCurrency.icon_url,
          id: getCurrency.name.ru,
          name: getCurrency.name,
        }}
        urlDirection={directions.noncash}
        urlGiveCurrency={{
          code_name: giveCurrency.code_name,
          icon_url: giveCurrency.icon_url,
          id: giveCurrency.name.ru,
          name: giveCurrency.name,
        }}
      />
      <ExchangersTable columns={columns} data={exchangers} />
      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={directions.noncash} />
    </section>
  );
};
