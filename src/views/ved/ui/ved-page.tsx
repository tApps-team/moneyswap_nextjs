import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedAgentsList } from "@/widgets/ved/ved-agents-list";
import { VedPageHeader } from "@/widgets/ved/ved-page-header";
import { Pagination } from "@/features/pagination";
import { getVedAgents, getVedPage } from "@/entities/strapi";
import { routes } from "@/shared/router";

const PAGE_SIZE = 10;

interface VedPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const VedPage = async ({ searchParams }: VedPageProps) => {
  const page = Number(searchParams?.page) || 1;

  const [vedPageRes, vedAgentsRes] = await Promise.all([
    getVedPage(),
    getVedAgents({ page, pageSize: PAGE_SIZE }),
  ]);
  const vedPage = vedPageRes.data;
  const agents = vedAgentsRes.data ?? [];
  const totalPages = vedAgentsRes.meta?.pagination?.pageCount ?? 1;

  const title = vedPage?.title ?? "Рейтинг платежных агентов";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VedPageHeader title={title} />

      {vedPage?.header_content?.length ? (
        <DynamicContent dynamic_content={vedPage.header_content} />
      ) : null}

      <div className="grid gap-8">
        <VedAgentsList agents={agents} />

        {totalPages > 1 ? (
          <div className="flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} route={routes.ved} />
          </div>
        ) : null}
      </div>

      {vedPage?.footer_content?.length ? (
        <DynamicContent dynamic_content={vedPage.footer_content} />
      ) : null}
    </section>
  );
};
