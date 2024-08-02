import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSeoMeta, getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const ExchangePage = async ({ params }: { params: { slug: string[] } }) => {
  // запрос на сео текста
  const seoTexts = await getSeoTexts({
    page: pageTypes.exchange_noncash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
    // city: "Москва",
    // country: "Россия",
  });
  // запрос на мета данные
  const seoMeta = await getSeoMeta({
    page: pageTypes.exchange_noncash,
    giveCurrency: "Биткоин BTC",
    getCurrency: "TETHER 20TRC",
    // city: "Москва",
    // country: "Россия",
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
