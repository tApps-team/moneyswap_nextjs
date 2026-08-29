import { getPaymentServiceBySlug } from "@/entities/strapi";
import { PaymentServiceContent } from "./payment-service-content";

interface PaymentServicePageProps {
  slug: string;
}

export const PaymentServicePage = async ({ slug }: PaymentServicePageProps) => {
  const { data: service } = await getPaymentServiceBySlug({ slug });

  if (!service) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <PaymentServiceContent service={service} />
    </section>
  );
};
