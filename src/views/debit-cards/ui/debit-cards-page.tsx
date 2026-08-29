import { DebitCardsExplorer } from "@/widgets/cards/debit-cards-explorer";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { getAllDebitCards, getDebitCardPage } from "@/entities/strapi";
import { SectionHeader } from "@/shared/ui";

export const DebitCardsPage = async () => {
  const [pageRes, cards] = await Promise.all([getDebitCardPage(), getAllDebitCards()]);

  const page = pageRes.data;
  const title = page?.title ?? "Дебетовые карты банков";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <DynamicContent dynamic_content={page.header_content} />
      ) : null}

      <DebitCardsExplorer cards={cards} />

      {page?.footer_content?.length ? (
        <DynamicContent dynamic_content={page.footer_content} />
      ) : null}
    </section>
  );
};
