import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Esim,
  formatEsimPrice,
  formatEsimValidityPeriod,
  formatEsimVolume,
  getEsimRating,
  getEsimReviewBreakdown,
} from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { TagCell } from "@/shared/ui";

const VISIBLE_CHIPS = 3;

/** Shared grid template — used by both the list header and each desktop row. */
export const ESIM_GRID =
  "grid grid-cols-[minmax(140px,1.2fr)_minmax(72px,0.7fr)_minmax(88px,0.8fr)_minmax(72px,0.7fr)_minmax(72px,0.7fr)_minmax(80px,0.75fr)_minmax(88px,0.8fr)_minmax(100px,0.85fr)_240px] gap-4 items-center";

interface EsimCardProps {
  service: Esim;
}

/** Desktop table row (chromeless — placed inside the shared list container). */
export function EsimRow({ service }: EsimCardProps) {
  const { ratingValue } = getEsimRating(service.reviews);
  const displayRating = ratingValue || service.rating || 0;
  const breakdown = getEsimReviewBreakdown(service.reviews);

  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        service.is_vip && "bg-yellow-main/[0.05]",
        ESIM_GRID,
      )}
    >
      {service.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}
      <ServiceIdentity service={service} />
      <TagCell
        items={service.labels}
        modalTitle="Метки"
        visibleCount={2}
        chip="circle"
        className="flex-nowrap"
      />
      <TagCell
        items={service.countries}
        modalTitle="Страны"
        visibleCount={2}
        chip="flag"
        className="flex-nowrap"
      />
      <ValueCell value={formatEsimPrice(service.connection_price)} />
      <ValueCell value={formatEsimVolume(service.internet_volume)} />
      <ValueCell value={formatEsimValidityPeriod(service.validity_period)} />
      <TagCell
        items={service.payment_systems}
        modalTitle="Оплата"
        visibleCount={VISIBLE_CHIPS}
        chip="icon"
        className="flex-nowrap"
      />
      <RatingBlock ratingValue={displayRating} breakdown={breakdown} />
      <ActionButtons slug={service.slug} url={service.url} className="justify-end" />
    </div>
  );
}

/** Mobile card. */
export function EsimCard({ service }: EsimCardProps) {
  const { ratingValue } = getEsimRating(service.reviews);
  const displayRating = ratingValue || service.rating || 0;
  const breakdown = getEsimReviewBreakdown(service.reviews);

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4",
        service.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {service.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-center gap-3">
        <ServiceIdentity service={service} className="flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Field label="Цена" value={formatEsimPrice(service.connection_price)} />
        <Field label="Объём" value={formatEsimVolume(service.internet_volume)} />
        <Field label="Срок" value={formatEsimValidityPeriod(service.validity_period)} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label="Метки" items={service.labels} chip="circle" />
        <LabeledTags label="Страны" items={service.countries} chip="flag" />
        <LabeledTags label="Оплата" items={service.payment_systems} chip="icon" />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <span className="text-light-gray text-[10px] uppercase tracking-wide font-normal">
          Отзывы
        </span>
        <RatingBlock ratingValue={displayRating} breakdown={breakdown} compact />
      </div>

      <ActionButtons slug={service.slug} url={service.url} stacked />
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
      <span className="text-light-gray text-[8px] uppercase tracking-wide truncate">{label}</span>
      <span className="text-white text-2xs font-normal truncate">{value}</span>
    </div>
  );
}

function LabeledTags({
  label,
  items,
  chip,
}: {
  label: string;
  items: { id: number; title: string; icon?: string; code?: string }[];
  chip: "circle" | "icon" | "flag" | "code";
}) {
  if (!items.length) return null;
  return (
    <div className="grid gap-1.5">
      <span className="text-light-gray text-[10px] uppercase tracking-wide font-normal">
        {label}
      </span>
      <TagCell items={items} modalTitle={label} chip={chip} />
    </div>
  );
}

function ServiceIdentity({ service, className }: { service: Esim; className?: string }) {
  return (
    <Link
      href={`${routes.esim}/${service.slug}`}
      className={cn("flex items-center gap-3 min-w-0 hover:opacity-90", className)}
    >
      {service.logo ? (
        <Image
          src={service.logo}
          alt={service.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-lg object-contain bg-new-grey shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-new-grey text-yellow-main font-semibold shrink-0">
          {service.name.charAt(0)}
        </div>
      )}
      <span className="font-medium lg:font-semibold text-white text-xs lg:text-base truncate">
        {service.name}
      </span>
    </Link>
  );
}

function ValueCell({ value }: { value: string }) {
  return <span className="text-sm text-white whitespace-nowrap">{value}</span>;
}

function RatingBlock({
  ratingValue,
  breakdown,
  compact,
}: {
  ratingValue: number;
  breakdown: { positive: number; neutral: number; negative: number };
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-green-400">
        <Star
          className={cn("fill-green-400 stroke-green-400", compact ? "w-3.5 h-3.5" : "w-4 h-4")}
        />
        <span className={cn(compact ? "text-xs font-medium" : "text-sm font-semibold")}>
          {ratingValue || "—"}
        </span>
      </div>
      <div
        className={cn(
          "flex items-center gap-1",
          compact ? "text-[10px] font-normal" : "text-xs font-medium",
        )}
      >
        <span className="text-yellow-main">{breakdown.positive}</span>
        <span className="text-light-gray">{breakdown.neutral}</span>
        <span className="text-[#D20000]">{breakdown.negative}</span>
      </div>
    </div>
  );
}

function ActionButtons({
  slug,
  url,
  className,
  stacked,
}: {
  slug: string;
  url: string;
  className?: string;
  stacked?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", stacked && "flex-col", className)}>
      <Link
        href={`${routes.esim}/${slug}`}
        className={cn(
          "text-center rounded-[10px] border border-[#575A62] text-white font-normal text-xs lg:text-sm px-4 py-2.5 hover:border-yellow-main hover:text-yellow-main transition-colors",
          stacked ? "w-full" : "flex-1 lg:flex-none",
        )}
      >
        Подробнее
      </Link>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-center rounded-[10px] bg-yellow-main text-black font-normal lg:font-medium text-xs lg:text-sm px-4 py-2.5 hover:bg-yellow-main/90 transition-colors whitespace-nowrap",
          stacked ? "w-full" : "flex-1 lg:flex-none",
        )}
      >
        Перейти
      </Link>
    </div>
  );
}
