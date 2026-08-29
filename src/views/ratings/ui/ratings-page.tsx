import { RatingsGrid, RatingsGridItem } from "@/widgets/ratings/ratings-grid";
import {
  DynamicContentItem,
  getBankCreditPage,
  getCreditCardPage,
  getDebitCardPage,
  getEsimPage,
  getFirstParagraphText,
  getMicroloanPage,
  getPaymentServicePage,
  getVcPage,
  getVedPage,
} from "@/entities/strapi";
import { RATING_SECTIONS, RatingSectionKey } from "@/shared/consts";
import { SectionHeader } from "@/shared/ui";

type SectionPageResponse = { data: { header_content?: DynamicContentItem[] } | null };

/** Раздел → single type его страницы в Strapi: оттуда берём описание для карточки. */
const PAGE_LOADERS: Record<RatingSectionKey, () => Promise<SectionPageResponse>> = {
  ved: getVedPage,
  "virtual-cards": getVcPage,
  esim: getEsimPage,
  "payment-services": getPaymentServicePage,
  "debit-cards": getDebitCardPage,
  "credit-cards": getCreditCardPage,
  credits: getBankCreditPage,
  microloans: getMicroloanPage,
};

export const RatingsPage = async () => {
  const pages = await Promise.all(
    RATING_SECTIONS.map((section) => PAGE_LOADERS[section.key]()),
  );

  const items: RatingsGridItem[] = RATING_SECTIONS.map((section, index) => ({
    section,
    description: getFirstParagraphText(pages[index]?.data?.header_content, 200),
  }));

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader
        title="Рейтинги сервисов"
        subtitle="Независимые подборки MoneySwap: международные платежи, карты для оплаты за рубежом, eSIM, банковские продукты и микрозаймы. Выберите раздел, чтобы сравнить условия и отзывы."
      />

      <RatingsGrid items={items} />
    </section>
  );
};
