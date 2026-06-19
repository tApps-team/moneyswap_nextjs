import { Gift, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedReviews } from "@/widgets/ved/ved-reviews";
import {
  VirtualCard,
  getVcRating,
  getVirtualCardBySlug,
} from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

interface VirtualCardPageProps {
  slug: string;
}

export const VirtualCardPage = async ({ slug }: VirtualCardPageProps) => {
  const { data: card } = await getVirtualCardBySlug({ slug });

  if (!card) {
    return null;
  }

  const { ratingValue, reviewCount } = getVcRating(card.reviews);

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px]">
      <VirtualCardHero card={card} ratingValue={ratingValue} reviewCount={reviewCount} />

      {card.promocodes.length > 0 ? <VcPromocodes card={card} /> : null}

      <VedReviews reviews={card.reviews} />

      {card.about?.length ? <DynamicContent dynamic_content={card.about} /> : null}
    </section>
  );
};

function VirtualCardHero({
  card,
  ratingValue,
  reviewCount,
}: {
  card: VirtualCard;
  ratingValue: number;
  reviewCount: number;
}) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Image
            src={card.logo}
            alt={card.name}
            width={64}
            height={64}
            className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-xl object-contain bg-new-grey shrink-0"
          />
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold truncate">
              {card.name}
            </h1>
            <div className="flex items-center gap-1 text-green-400 text-xs mobile-xl:text-sm">
              <Star className="w-3.5 h-3.5 mobile-xl:w-4 mobile-xl:h-4 fill-green-400" />
              <span className="font-semibold">{ratingValue || "—"}</span>
              <span className="text-light-gray">({reviewCount} отзывов)</span>
            </div>
          </div>
        </div>

        <Link
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-fit px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Оформить
        </Link>
      </div>

      <div className="grid grid-cols-1 mobile-xl:grid-cols-3 gap-4">
        <HeroStat label="Выпуск карты" value={`от ${card.issuance_cost} ₽`} />
        <HeroStat label="Обслуживание" value={card.maintenance_info} />
        <HeroStat label="Комиссия пополнения" value={card.topup_commission} />
      </div>

      {card.platforms.length > 0 && (
        <div className="grid gap-2">
          <span className="text-xs mobile-xl:text-sm text-light-gray uppercase">Сервисы</span>
          <TagCell items={card.platforms} modalTitle="Сервисы" visibleCount={3} chip="icon" />
        </div>
      )}

      {card.payment_systems.length > 0 && (
        <div className="grid gap-2">
          <span className="text-xs mobile-xl:text-sm text-light-gray uppercase">
            Платёжные системы
          </span>
          <div className="flex flex-wrap gap-2">
            {card.payment_systems.map((system) => (
              <span
                key={system.id}
                className="px-3 py-1.5 rounded-lg bg-new-grey text-xs mobile-xl:text-sm text-white"
              >
                {system.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 rounded-[10px] border border-[#575A62]/40">
      <span className="text-light-gray text-[10px] mobile-xl:text-xs uppercase">{label}</span>
      <span className="text-white text-sm mobile-xl:text-base font-medium">{value}</span>
    </div>
  );
}

function VcPromocodes({ card }: { card: VirtualCard }) {
  return (
    <div className="grid gap-4">
      <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
        Промокоды
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {card.promocodes.map((promo, index) => (
          <Link
            key={`${promo.title}-${index}`}
            href={promo.url || card.url}
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
