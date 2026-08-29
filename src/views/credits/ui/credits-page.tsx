import { CreditsExplorer } from "@/widgets/credits/credits-explorer";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { getAllBankCredits, getBankCreditPage } from "@/entities/strapi";
import { SectionHeader } from "@/shared/ui";

export const CreditsPage = async () => {
  const [pageRes, credits] = await Promise.all([getBankCreditPage(), getAllBankCredits()]);

  const page = pageRes.data;
  const title = page?.title ?? "Потребительские кредиты";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <DynamicContent dynamic_content={page.header_content} />
      ) : null}

      <CreditsExplorer credits={credits} />

      {page?.footer_content?.length ? (
        <DynamicContent dynamic_content={page.footer_content} />
      ) : null}
    </section>
  );
};
