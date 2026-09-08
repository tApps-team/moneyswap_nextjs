import { getCreditCardBySlug } from "@/entities/strapi";
import { CreditCardContent } from "./credit-card-content";

interface CreditCardPageProps {
  slug: string;
}

export const CreditCardPage = async ({ slug }: CreditCardPageProps) => {
  const { data: card } = await getCreditCardBySlug({ slug });

  if (!card) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <CreditCardContent card={card} />
    </section>
  );
};
