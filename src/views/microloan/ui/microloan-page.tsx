import { getMicroloanBySlug } from "@/entities/strapi";
import { MicroloanContent } from "./microloan-content";

interface MicroloanPageProps {
  slug: string;
}

export const MicroloanPage = async ({ slug }: MicroloanPageProps) => {
  const { data: loan } = await getMicroloanBySlug({ slug });

  if (!loan) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <MicroloanContent loan={loan} />
    </section>
  );
};
