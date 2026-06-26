import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VirtualCard, getVcReviewBreakdown } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { TagCell } from "@/shared/ui";
import { VcPromoTooltip } from "./vc-promo-tooltip";

const VISIBLE_PLATFORMS = 3;

/** Shared grid template — used by both the list header and each desktop row. */
export const VC_GRID =
  "grid grid-cols-[minmax(150px,1.4fr)_minmax(90px,0.7fr)_minmax(110px,0.9fr)_minmax(120px,0.9fr)_minmax(150px,1fr)_minmax(90px,0.7fr)_minmax(300px,1.4fr)] gap-4 items-center";

interface VcCardProps {
  card: VirtualCard;
}

/** Desktop table row (chromeless — placed inside the shared list container). */
export function VcRow({ card }: VcCardProps) {
  const breakdown = getVcReviewBreakdown(card.reviews);

  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        card.is_vip && "bg-yellow-main/[0.05]",
        VC_GRID,
      )}
    >
      {card.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}
      <CardIdentity card={card} />
      <ValueCell value={`от ${card.issuance_cost} ₽`} />
      <ValueCell value={card.maintenance_info} />
      <ValueCell value={card.topup_commission} />
      <TagCell
        items={card.platforms}
        modalTitle="Сервисы"
        visibleCount={VISIBLE_PLATFORMS}
        chip="icon"
        className="flex-nowrap"
      />
      <RatingBlock breakdown={breakdown} />
      <ActionsCell card={card} />
    </div>
  );
}

/** Mobile card. */
export function VcCard({ card }: VcCardProps) {
  const breakdown = getVcReviewBreakdown(card.reviews);
  const hasPromo = card.promocodes.length > 0;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4",
        card.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {card.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-center gap-3">
        <CardIdentity card={card} className="flex-1" />
        <RatingBlock breakdown={breakdown} compact />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Field label="Выпуск" value={`от ${card.issuance_cost} ₽`} />
        <Field label="Комиссия" value={card.topup_commission} />
        <Field label="Обслуживание" value={card.maintenance_info} />
      </div>

      {card.platforms.length > 0 && (
        <div className="grid gap-1.5">
          <span className="text-light-gray text-[11px] uppercase tracking-wide font-medium">
            Сервисы
          </span>
          <TagCell
            items={card.platforms}
            modalTitle="Сервисы"
            visibleCount={VISIBLE_PLATFORMS}
            chip="icon"
          />
        </div>
      )}

      <div className="grid gap-2 border-t border-white/[0.06] pt-3">
        {hasPromo ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ReviewLink slug={card.slug} />
              <PromoLink slug={card.slug} />
            </div>
            <SubmitButton url={card.url} className="w-full" />
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <ReviewLink slug={card.slug} />
            <SubmitButton url={card.url} className="w-full" />
          </div>
        )}
      </div>
    </article>
  );
}

function VipBadge({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 bg-yellow-main text-black text-[9px] font-bold uppercase mobile-xl:px-3 px-2 mobile-xl:py-1 py-1 lg:rounded-[0px] rounded-[4px] shadow-sm whitespace-nowrap pointer-events-none",
        className,
      )}
    >
      {label}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-[10px] bg-new-grey/40 px-2.5 py-2 min-w-0">
      <span className="text-light-gray text-[10px] uppercase tracking-wide truncate">{label}</span>
      <span className="text-white text-xs font-medium truncate">{value}</span>
    </div>
  );
}

function ReviewLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`${routes.vc_cards}/${slug}`}
      className="text-center rounded-[10px] border border-[#575A62] text-white text-[13px] font-medium px-4 py-2.5 hover:border-yellow-main hover:text-yellow-main transition-colors"
    >
      Обзор
    </Link>
  );
}

function PromoLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`${routes.vc_cards}/${slug}`}
      className="flex items-center justify-center gap-1.5 rounded-[10px] bg-new-grey text-yellow-main text-[13px] font-medium px-4 py-2.5 hover:bg-yellow-main hover:text-black transition-colors"
    >
      <Gift className="w-3.5 h-3.5" />
      Бонусы
    </Link>
  );
}

function CardIdentity({ card, className }: { card: VirtualCard; className?: string }) {
  return (
    <Link
      href={`${routes.vc_cards}/${card.slug}`}
      className={cn("flex items-center gap-3 min-w-0 hover:opacity-90", className)}
    >
      {card.logo ? (
        <Image
          src={card.logo}
          alt={card.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-contain bg-new-grey shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-new-grey text-yellow-main font-semibold shrink-0">
          {card.name.charAt(0)}
        </div>
      )}
      <span className="font-semibold text-white text-sm lg:text-base truncate">{card.name}</span>
    </Link>
  );
}

function ValueCell({ value }: { value: string }) {
  return <span className="text-sm text-white whitespace-nowrap">{value}</span>;
}

function RatingBlock({
  breakdown,
  compact,
}: {
  breakdown: { positive: number; neutral: number; negative: number };
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1 font-medium", compact ? "text-[11px]" : "text-xs")}>
      <span className="text-yellow-main">{breakdown.positive}</span>
      <span className="text-light-gray">{breakdown.neutral}</span>
      <span className="text-[#D20000]">{breakdown.negative}</span>
    </div>
  );
}

/** Desktop "Обзор и промокоды" cell — spans review, promo, and submit actions. */
function ActionsCell({ card }: { card: VirtualCard }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`${routes.vc_cards}/${card.slug}`}
        className="text-center rounded-[8px] border border-[#575A62] text-white text-sm px-4 py-2 hover:border-yellow-main hover:text-yellow-main transition-colors"
      >
        Обзор
      </Link>
      <VcPromoTooltip slug={card.slug} promocodes={card.promocodes} />
      <SubmitButton url={card.url} className="ml-auto" />
    </div>
  );
}

function SubmitButton({ url, className }: { url: string; className?: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-center rounded-[10px] bg-yellow-main text-black font-medium text-[13px] lg:text-sm px-4 py-2.5 hover:bg-yellow-main/90 transition-colors whitespace-nowrap",
        className,
      )}
    >
      Оформить
    </Link>
  );
}
