import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSeoTexts } from "@/shared/api";
import { pageTypes } from "@/shared/types";

export const BuyPage = async () => {
  const seoTexts = await getSeoTexts({
    page: pageTypes.buy_cash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
  });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <div>sell</div>
      <MainFAQ />
      <SeoFooterText data={seoTexts.data} />
    </section>
  );
};
