import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VcExplorer } from "@/widgets/vc/vc-explorer";
import { VcPageHeader } from "@/widgets/vc/vc-page-header";
import { VcMarketType, getAllVirtualCards, getVcPage } from "@/entities/strapi";

interface VirtualCardsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const VirtualCardsPage = async ({ searchParams }: VirtualCardsPageProps) => {
  const marketType: VcMarketType = searchParams?.market === "russian" ? "russian" : "international";

  const [vcPageRes, cards] = await Promise.all([getVcPage(), getAllVirtualCards(marketType)]);

  const vcPage = vcPageRes.data;
  const title = vcPage?.title ?? "Зарубежные виртуальные карты — рейтинг";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VcPageHeader title={title} />

      {vcPage?.header_content?.length ? (
        <DynamicContent dynamic_content={vcPage.header_content} />
      ) : null}

      <VcExplorer cards={cards} />

      {vcPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={vcPage.footer_content} />
      ) : null}
    </section>
  );
};
