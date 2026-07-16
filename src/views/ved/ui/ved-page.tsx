import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedAgentsExplorer } from "@/widgets/ved/ved-agents-explorer";
import { VedPageHeader } from "@/widgets/ved/ved-page-header";
import { getAllVedAgents, getVedPage } from "@/entities/strapi";

export const VedPage = async () => {
  const [vedPageRes, agents] = await Promise.all([getVedPage(), getAllVedAgents()]);
  const vedPage = vedPageRes.data;

  const title = vedPage?.title ?? "Рейтинг платежных агентов";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VedPageHeader title={title} />

      {vedPage?.header_content?.length ? (
        <DynamicContent dynamic_content={vedPage.header_content} />
      ) : null}

      <VedAgentsExplorer agents={agents} />

      {vedPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={vedPage.footer_content} />
      ) : null}
    </section>
  );
};
