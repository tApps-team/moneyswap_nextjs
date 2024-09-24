import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/strapi";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const BuyPage = async () => {
  const seoTexts = await getSeoTexts({
    page: pageTypes.buy_noncash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
  });
  return (
    <section>
      <SeoHeaderText data={seoTexts.data} />
      <div>sell</div>
      <SeoFooterText data={seoTexts.data} />
      <MainFAQ direction={directions.noncash} />
    </section>
  );
};
