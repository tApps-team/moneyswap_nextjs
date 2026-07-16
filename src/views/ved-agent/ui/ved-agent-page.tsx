import { Gift, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedReviews } from "@/widgets/ved/ved-reviews";
import {
  VedAgent,
  formatVedLimit,
  getVedAgentBySlug,
  getVedReviewBreakdown,
} from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

interface VedAgentPageProps {
  slug: string;
}

export const VedAgentPage = async ({ slug }: VedAgentPageProps) => {
  const { data: agent } = await getVedAgentBySlug({ slug });

  if (!agent) {
    return null;
  }

  const breakdown = getVedReviewBreakdown(agent.reviews);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VedAgentHero agent={agent} breakdown={breakdown} />

      {(agent.promocodes?.length ?? 0) > 0 ? <VedPromocodes agent={agent} /> : null}

      {/* Временно скрыт блок отзывов (логика сохранена) */}
      {/* <VedReviews reviews={agent.reviews} /> */}

      {agent.about?.length ? <DynamicContent dynamic_content={agent.about} /> : null}
    </section>
  );
};

function VedPromocodes({ agent }: { agent: VedAgent }) {
  return (
    <div className="grid gap-4">
      <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
        Промокоды
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agent.promocodes.map((promo, index) => (
          <Link
            key={`${promo.title}-${index}`}
            href={promo.url || agent.url}
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

function VedAgentHero({
  agent,
  breakdown,
}: {
  agent: VedAgent;
  breakdown: { positive: number; neutral: number; negative: number };
}) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {agent.logo ? (
            <Image
              src={agent.logo}
              alt={agent.name}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {agent.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold truncate">
              {agent.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs mobile-xl:text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-main/15 text-yellow-main">
                <MapPin className="w-3.5 h-3.5" />
                От {agent.commission}%
              </span>
              {/* Временно скрыт блок отзывов 0 0 0 (логика сохранена)
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-yellow-main">{breakdown.positive}</span>
                <span className="text-light-gray">{breakdown.neutral}</span>
                <span className="text-[#D20000]">{breakdown.negative}</span>
              </div>
              */}
            </div>
            <p className="text-xs mobile-xl:text-sm text-light-gray">
              От <span className="text-green-400">{formatVedLimit(agent.limits.from)}</span> — До{" "}
              <span className="text-[#e8a090]">{formatVedLimit(agent.limits.to)}</span> USD
            </p>
          </div>
        </div>

        <Link
          href={agent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-fit px-5 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Связаться
        </Link>
      </div>

      <div className="grid gap-4 mobile-xl:grid-cols-2">
        {agent.labels.length > 0 && (
          <div className="grid gap-2">
            <span className="text-xs mobile-xl:text-sm text-light-gray uppercase">Метки</span>
            <TagCell items={agent.labels} modalTitle="Метки" visibleCount={3} chip="circle" />
          </div>
        )}
        {agent.countries.length > 0 && (
          <div className="grid gap-2">
            <span className="text-xs mobile-xl:text-sm text-light-gray uppercase">Страны</span>
            <TagCell items={agent.countries} modalTitle="Страны" visibleCount={3} chip="flag" />
          </div>
        )}
      </div>
    </div>
  );
}
