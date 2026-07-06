import { Gift, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VedAgent, formatVedLimit, getVedReviewBreakdown } from "@/entities/strapi";
import { TelegramIcon } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { TagCell } from "@/shared/ui";
import { VedPromoTooltip } from "./ved-promo-tooltip";

const VISIBLE_CHIPS = 3;

/** Shared grid template — used by both the list header and each desktop row. */
// ВРЕМЕННО: колонка "Отзывы" (minmax(80px,0.6fr)) убрана из сетки. Вернуть строку ниже когда появятся отзывы:
// export const VED_GRID =
//   "grid grid-cols-[minmax(140px,1.2fr)_minmax(80px,0.8fr)_minmax(100px,0.9fr)_minmax(90px,0.8fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(80px,0.6fr)_auto] gap-4 items-center";
export const VED_GRID =
  "grid grid-cols-[minmax(140px,1.2fr)_minmax(80px,0.8fr)_minmax(100px,0.9fr)_minmax(90px,0.8fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_auto] gap-4 items-center";

interface VedAgentCardProps {
  agent: VedAgent;
}

/** Desktop table row (chromeless — placed inside the shared list container). */
export function VedAgentRow({ agent }: VedAgentCardProps) {
  // ВРЕМЕННО скрыты отзывы: const breakdown = getVedReviewBreakdown(agent.reviews);
  const commissionPrefix = "От";

  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        agent.is_vip && "bg-yellow-main/[0.05]",
        VED_GRID,
      )}
    >
      {agent.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}
      <AgentIdentity agent={agent} />
      <TagCell
        items={agent.labels}
        modalTitle="Метки"
        visibleCount={VISIBLE_CHIPS}
        chip="circle"
        className="flex-nowrap"
      />
      <TagCell
        items={agent.countries}
        modalTitle="Страны"
        visibleCount={VISIBLE_CHIPS}
        chip="flag"
        className="flex-nowrap"
      />
      <TagCell
        items={agent.currencies}
        modalTitle="Валюты"
        visibleCount={2}
        chip="code"
        className="flex-nowrap"
      />
      <CommissionBadge prefix={commissionPrefix} value={agent.commission} />
      <LimitsBlock limits={agent.limits} />
      {/* ВРЕМЕННО скрыт блок отзывов (вместе с колонкой в VED_GRID и заголовком):
      <RatingBlock breakdown={breakdown} /> */}
      <div className="flex items-center gap-2 justify-self-end">
        <VedPromoTooltip slug={agent.slug} promocodes={agent.promocodes ?? []} />
        <TelegramButton url={agent.url} />
      </div>
    </div>
  );
}

/** Mobile card. */
export function VedAgentCard({ agent }: VedAgentCardProps) {
  // ВРЕМЕННО скрыты отзывы: const breakdown = getVedReviewBreakdown(agent.reviews);
  const commissionPrefix = "От";

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4",
        agent.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {agent.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-center gap-3">
        <AgentIdentity agent={agent} className="flex-1" />
        {/* ВРЕМЕННО скрыт блок отзывов: <RatingBlock breakdown={breakdown} compact /> */}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CommissionBadge prefix={commissionPrefix} value={agent.commission} />
        <MobileLimits limits={agent.limits} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label="Метки" items={agent.labels} chip="circle" />
        <LabeledTags label="Страны" items={agent.countries} chip="flag" />
        <LabeledTags label="Валюты" items={agent.currencies} chip="code" visibleCount={2} />
      </div>

      {(agent.promocodes?.length ?? 0) > 0 ? (
        <div className="grid gap-2">
          <PromoLink slug={agent.slug} />
          <ContactButton url={agent.url} />
        </div>
      ) : (
        <ContactButton url={agent.url} />
      )}
    </article>
  );
}

function PromoLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`${routes.ved_agents}/${slug}`}
      className="flex items-center justify-center gap-1.5 w-full rounded-[10px] bg-new-grey text-yellow-main text-[13px] font-medium py-2.5 hover:bg-yellow-main hover:text-black transition-colors"
    >
      <Gift className="w-3.5 h-3.5" />
      Бонусы
    </Link>
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

function LabeledTags({
  label,
  items,
  chip,
  visibleCount,
}: {
  label: string;
  items: { id: number; title: string; icon?: string; code?: string }[];
  chip: "circle" | "icon" | "flag" | "code";
  visibleCount?: number;
}) {
  if (!items.length) return null;
  return (
    <div className="grid gap-1.5">
      <span className="text-light-gray text-[11px] uppercase tracking-wide font-medium">
        {label}
      </span>
      <TagCell items={items} modalTitle={label} chip={chip} visibleCount={visibleCount} />
    </div>
  );
}

function MobileLimits({ limits }: { limits: VedAgent["limits"] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
        <span className="text-light-gray">От</span>
        <span className="text-green-400 font-medium">{formatVedLimit(limits.from)}</span>
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
        <span className="text-light-gray">До</span>
        <span className="text-[#e8a090] font-medium">{formatVedLimit(limits.to)}</span>
      </span>
    </div>
  );
}

function ContactButton({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full rounded-[10px] bg-yellow-main text-black font-medium text-[13px] py-2.5 hover:bg-yellow-main/90 transition-colors"
    >
      Связаться
      <TelegramIcon className="w-4 h-4" fill="#000" />
    </Link>
  );
}

function AgentIdentity({ agent, className }: { agent: VedAgent; className?: string }) {
  return (
    <Link
      href={`${routes.ved_agents}/${agent.slug}`}
      className={cn("flex items-center gap-3 min-w-0 hover:opacity-90", className)}
    >
      {agent.logo ? (
        <Image
          src={agent.logo}
          alt={agent.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-contain bg-new-grey shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-new-grey text-yellow-main font-semibold shrink-0">
          {agent.name.charAt(0)}
        </div>
      )}
      <span className="font-semibold text-white text-sm lg:text-base truncate">{agent.name}</span>
    </Link>
  );
}

function CommissionBadge({ prefix, value }: { prefix: string; value: number }) {
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-main/15 text-yellow-main text-xs font-medium lg:font-normal whitespace-nowrap">
      <MapPin className="w-3.5 h-3.5 shrink-0" />
      <span>
        {prefix} {value}%
      </span>
    </div>
  );
}

function LimitsBlock({ limits }: { limits: VedAgent["limits"] }) {
  return (
    <div className="grid gap-0.5 text-xs whitespace-nowrap">
      <p>
        От <span className="text-green-400 font-medium">{formatVedLimit(limits.from)}</span>
      </p>
      <p>
        До <span className="text-[#e8a090] font-medium">{formatVedLimit(limits.to)}</span>
      </p>
    </div>
  );
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

function TelegramButton({ url, className }: { url: string; className?: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-main hover:bg-yellow-main/90 hover:scale-[1.03] active:scale-[0.98] transition-all",
        className,
      )}
      aria-label="Telegram"
    >
      <TelegramIcon className="w-5 h-5" fill="#000" />
    </Link>
  );
}
