import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Esim,
  getEsimBySlug,
  getEsimReviewBreakdown,
} from "@/entities/strapi";
import { EsimServiceContent } from "./esim-service-content";

interface EsimServicePageProps {
  slug: string;
}

export const EsimServicePage = async ({ slug }: EsimServicePageProps) => {
  const { data: service } = await getEsimBySlug({ slug });

  if (!service) {
    return null;
  }

  const breakdown = getEsimReviewBreakdown(service.reviews);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <EsimServiceHero service={service} breakdown={breakdown} />
      {(service.promocodes?.length ?? 0) > 0 ? <EsimPromocodes service={service} /> : null}
      <EsimServiceContent service={service} />
    </section>
  );
};

function EsimPromocodes({ service }: { service: Esim }) {
  return (
    <div className="grid gap-4">
      <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
        Промокоды
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {service.promocodes.map((promo, index) => (
          <Link
            key={`${promo.title}-${index}`}
            href={promo.url || service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-new-dark-grey border border-[#575A62]/50 rounded-[15px] p-5 hover:border-yellow-main transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-yellow-main/15 text-yellow-main">
              <Gift className="w-5 h-5" />
            </div>
            <div className="grid gap-1 min-w-0">
              <span className="font-semibold text-white text-sm mobile-xl:text-base">
                {promo.title}
              </span>
              <span className="text-xs mobile-xl:text-sm text-light-gray">{promo.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EsimServiceHero({
  service,
  breakdown,
}: {
  service: Esim;
  breakdown: { positive: number; neutral: number; negative: number };
}) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {service.logo ? (
            <Image
              src={service.logo}
              alt={service.name}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {service.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              Виртуальные сим-карты {service.name}
            </h1>
            {/* Временно скрыт блок отзывов 0 0 0 (логика сохранена)
            <div className="flex items-center gap-1.5 text-xs mobile-xl:text-sm font-medium">
              <span className="text-yellow-main">{breakdown.positive}</span>
              <span className="text-light-gray">{breakdown.neutral}</span>
              <span className="text-[#D20000]">{breakdown.negative}</span>
            </div>
            */}
          </div>
        </div>

        <Link
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-fit px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Перейти на сайт
        </Link>
      </div>
    </div>
  );
}
