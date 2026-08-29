import { CreditCardsExplorer } from "@/widgets/cards/credit-cards-explorer";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { getAllCreditCards, getCreditCardPage } from "@/entities/strapi";
import { SectionHeader } from "@/shared/ui";

export const CreditCardsPage = async () => {
  const [pageRes, cards] = await Promise.all([getCreditCardPage(), getAllCreditCards()]);

  const page = pageRes.data;
  const title = page?.title ?? "Кредитные карты банков";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <DynamicContent dynamic_content={page.header_content} />
      ) : null}

      <CreditCardsExplorer cards={cards} />

      {page?.footer_content?.length ? (
        <DynamicContent dynamic_content={page.footer_content} />
      ) : null}
    </section>
  );
};
