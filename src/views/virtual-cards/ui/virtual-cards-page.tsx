import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VcCatalog } from "@/widgets/vc/vc-catalog";
import { VcPageHeader } from "@/widgets/vc/vc-page-header";
import { VcMarketType, getVcPage, getVirtualCards } from "@/entities/strapi";

const PAGE_SIZE = 10;

interface VirtualCardsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const VirtualCardsPage = async ({ searchParams }: VirtualCardsPageProps) => {
  const marketType: VcMarketType = searchParams?.market === "russian" ? "russian" : "international";
  const page = Number(searchParams?.page) || 1;

  const [vcPageRes, cardsRes] = await Promise.all([
    getVcPage(),
    getVirtualCards({ marketType, page, pageSize: PAGE_SIZE }),
  ]);

  const vcPage = vcPageRes.data;
  const cards = cardsRes.data ?? [];
  const totalPages = cardsRes.meta?.pagination?.pageCount ?? 1;
  const title = vcPage?.title ?? "Зарубежные виртуальные карты — рейтинг";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VcPageHeader title={title} />

      {vcPage?.header_content?.length ? (
        <DynamicContent dynamic_content={vcPage.header_content} />
      ) : null}

      <VcCatalog cards={cards} marketType={marketType} page={page} totalPages={totalPages} />

      {vcPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={vcPage.footer_content} />
      ) : null}
    </section>
  );
};
