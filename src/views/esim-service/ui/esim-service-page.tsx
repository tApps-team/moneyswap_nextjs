import { getEsimBySlug } from "@/entities/strapi";
import { EsimServiceContent } from "./esim-service-content";

interface EsimServicePageProps {
  slug: string;
}

export const EsimServicePage = async ({ slug }: EsimServicePageProps) => {
  const { data: service } = await getEsimBySlug({ slug });

  if (!service) {
    return null;
  }

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <EsimServiceContent service={service} />
    </section>
  );
};
