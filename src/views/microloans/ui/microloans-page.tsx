import { MfoExplorer } from "@/widgets/microloans/mfo-explorer";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { getAllMicroloans, getMicroloanPage } from "@/entities/strapi";
import { SectionHeader } from "@/shared/ui";

export const MicroloansPage = async () => {
  const [pageRes, loans] = await Promise.all([getMicroloanPage(), getAllMicroloans()]);

  const page = pageRes.data;
  const title = page?.title ?? "Микрозаймы онлайн";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <DynamicContent dynamic_content={page.header_content} />
      ) : null}

      <MfoExplorer loans={loans} />

      {page?.footer_content?.length ? (
        <DynamicContent dynamic_content={page.footer_content} />
      ) : null}
    </section>
  );
};
