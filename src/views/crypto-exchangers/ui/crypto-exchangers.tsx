import { CryptoSeoText } from "@/widgets/crypto-exchangers/crypto-seo-text";
import { CryptoTable } from "@/widgets/crypto-exchangers/crypto-table";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangerList } from "@/entities/exchanger";
import { directions } from "@/shared/types";

export const CryptoExchangersPage = async ({ params }: { params: { exchanger: string[] } }) => {
  const giveCurrency = await getSpecificValute({
    codeName: "BTC",
  });
  const getCurrency = await getSpecificValute({
    codeName: "SBERRUB",
  });
  const actualCourse = await getActualCourse({ valuteFrom: "BTC", valuteTo: "SBERRUB" });
  const cryptoExchangers = await getExchangerList();
  return (
    <div>
      <CryptoSeoText />
      <BotBanner />
      <CurrencySelectForm
        urlDirection={directions.noncash}
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
      <CryptoTable data={cryptoExchangers} />
      <p>footer seo text</p>
    </div>
  );
};
