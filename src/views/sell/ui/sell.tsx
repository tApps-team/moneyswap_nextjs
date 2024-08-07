import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const SellPage = async () => {
  const seoTexts = await getSeoTexts({
    page: pageTypes.sell_cash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
  });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <div>main</div>
      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={directions.noncash} />
    </section>
  );
};
