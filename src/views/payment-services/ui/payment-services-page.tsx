import { PsExplorer } from "@/widgets/payment-services/ps-explorer";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { getAllPaymentServices, getPaymentServicePage } from "@/entities/strapi";
import { SectionHeader } from "@/shared/ui";

export const PaymentServicesPage = async () => {
  const [pageRes, services] = await Promise.all([
    getPaymentServicePage(),
    getAllPaymentServices(),
  ]);

  const page = pageRes.data;
  const title = page?.title ?? "Оплата зарубежных сервисов из России";

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <DynamicContent dynamic_content={page.header_content} />
      ) : null}

      <PsExplorer services={services} />

      {page?.footer_content?.length ? (
        <DynamicContent dynamic_content={page.footer_content} />
      ) : null}
    </section>
  );
};
