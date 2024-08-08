import { CurrecnySelectForm } from "@/widgets/currency-select-form";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { BotBanner } from "@/features/bot-banner";
import { getSpecificValute } from "@/entities/currency";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const Main = async () => {
  const seoTexts = await getSeoTexts({ page: pageTypes.main });
  const giveCurrency = await getSpecificValute({ codeName: "BTC" });
  const getCurrency = await getSpecificValute({ codeName: "SBERRUB" });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <BotBanner />
      <CurrecnySelectForm />
      <div>main</div>
      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={directions.noncash} />
    </section>
  );
};
