import { EsimExplorer } from "@/widgets/esim/esim-explorer";
import { EsimPageHeader } from "@/widgets/esim/esim-page-header";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { EsimMarketType, getAllEsims, getEsimPage } from "@/entities/strapi";

interface EsimPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const EsimPage = async ({ searchParams }: EsimPageProps) => {
  const marketType: EsimMarketType = searchParams?.market === "russian" ? "russian" : "international";

  const [esimPageRes, services] = await Promise.all([getEsimPage(), getAllEsims(marketType)]);

  const esimPage = esimPageRes.data;
  const title = esimPage?.title ?? "Рейтинг eSIM — международные и российские сим-карты";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <EsimPageHeader title={title} />

      {esimPage?.header_content?.length ? (
        <DynamicContent dynamic_content={esimPage.header_content} />
      ) : null}

      <EsimExplorer services={services} />

      {esimPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={esimPage.footer_content} />
      ) : null}
    </section>
  );
};
