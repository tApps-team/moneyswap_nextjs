import { EsimCatalog } from "@/widgets/esim/esim-catalog";
import { EsimPageHeader } from "@/widgets/esim/esim-page-header";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { EsimMarketType, getEsimPage, getEsims } from "@/entities/strapi";

const PAGE_SIZE = 10;

interface EsimPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const EsimPage = async ({ searchParams }: EsimPageProps) => {
  const marketType: EsimMarketType = searchParams?.market === "russian" ? "russian" : "international";
  const page = Number(searchParams?.page) || 1;

  const [esimPageRes, esimsRes] = await Promise.all([
    getEsimPage(),
    getEsims({ marketType, page, pageSize: PAGE_SIZE, noStore: true }),
  ]);

  const esimPage = esimPageRes.data;
  const services = esimsRes.data ?? [];
  const totalPages = esimsRes.meta?.pagination?.pageCount ?? 1;
  const title = esimPage?.title ?? "Рейтинг eSIM — международные и российские сим-карты";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <EsimPageHeader title={title} />

      {esimPage?.header_content?.length ? (
        <DynamicContent dynamic_content={esimPage.header_content} />
      ) : null}

      <EsimCatalog
        services={services}
        marketType={marketType}
        page={page}
        totalPages={totalPages}
      />

      {esimPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={esimPage.footer_content} />
      ) : null}
    </section>
  );
};
