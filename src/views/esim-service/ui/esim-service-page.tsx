import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Esim,
  getEsimBySlug,
  getEsimRating,
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

  const { ratingValue, reviewCount } = getEsimRating(service.reviews);
  const displayRating = ratingValue || service.rating || 0;

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <EsimServiceHero
        service={service}
        ratingValue={displayRating}
        reviewCount={reviewCount}
      />
      <EsimServiceContent service={service} />
    </section>
  );
};

function EsimServiceHero({
  service,
  ratingValue,
  reviewCount,
}: {
  service: Esim;
  ratingValue: number;
  reviewCount: number;
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
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-xl object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-xl bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {service.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              Виртуальные сим-карты {service.name}
            </h1>
            <div className="flex items-center gap-1 text-green-400 text-xs mobile-xl:text-sm">
              <Star className="w-3.5 h-3.5 mobile-xl:w-4 mobile-xl:h-4 fill-green-400" />
              <span className="font-semibold">{ratingValue || "—"}</span>
              <span className="text-light-gray">({reviewCount} отзывов)</span>
            </div>
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
