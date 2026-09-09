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
import {
  RATING_SECTIONS,
  RatingSectionKey,
  SECTION_GROUPS,
  getGroupRatingSections,
} from "@/shared/consts";
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

  const itemBySectionKey = new Map(items.map((item) => [item.section.key, item]));

  // Группы с рейтингами: у «Обмена валют» своих Strapi-разделов нет
  const groups = SECTION_GROUPS.map((group) => ({
    group,
    items: getGroupRatingSections(group)
      .map((section) => itemBySectionKey.get(section.key))
      .filter((item): item is RatingsGridItem => Boolean(item)),
  })).filter(({ items: groupItems }) => groupItems.length > 0);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader
        title="Рейтинги сервисов"
        subtitle="Независимые подборки MoneySwap: международные платежи, карты для оплаты за рубежом, eSIM, банковские продукты и микрозаймы. Выберите раздел, чтобы сравнить условия и отзывы."
      />

      {groups.map(({ group, items: groupItems }) => (
        // id — якорь для ссылок из меню и футера
        <div key={group.key} id={group.key} className="grid gap-5 min-w-0 scroll-mt-[130px]">
          <div className="grid gap-1.5 min-w-0">
            <h2 className="unbounded_font uppercase text-yellow-main mobile-xl:text-xl text-base font-semibold leading-tight">
              {group.title}
            </h2>
            <p className="text-light-gray mobile-xl:text-base text-sm leading-snug max-w-3xl">
              {group.subtitle}
            </p>
          </div>

          <RatingsGrid items={groupItems} />
        </div>
      ))}
    </section>
  );
};
