import { getBankCreditBySlug } from "@/entities/strapi";
import { CreditContent } from "./credit-content";

interface CreditPageProps {
  slug: string;
}

export const CreditPage = async ({ slug }: CreditPageProps) => {
  const { data: credit } = await getBankCreditBySlug({ slug });

  if (!credit) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <CreditContent credit={credit} />
    </section>
  );
};
