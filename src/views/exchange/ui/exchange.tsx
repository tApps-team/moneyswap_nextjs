import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const ExchangePage = async ({ params }: { params: { slug: string[] } }) => {
  const seoTexts = await getSeoTexts({
    page: pageTypes.exchange_noncash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
  });
  return (
    <div>
      <SeoHeaderText data={seoTexts.data} />
      <div>main</div>
      <MainFAQ />
      <SeoFooterText data={seoTexts.data} />
    </div>
  );
};
