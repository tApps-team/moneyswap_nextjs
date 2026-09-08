import { getDebitCardBySlug } from "@/entities/strapi";
import { DebitCardContent } from "./debit-card-content";

interface DebitCardPageProps {
  slug: string;
}

export const DebitCardPage = async ({ slug }: DebitCardPageProps) => {
  const { data: card } = await getDebitCardBySlug({ slug });

  if (!card) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <DebitCardContent card={card} />
    </section>
  );
};
