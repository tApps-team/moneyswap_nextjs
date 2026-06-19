import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VedAgent, formatVedLimit, getVedAgentRating } from "@/entities/strapi";
import { TelegramIcon } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { TagCell } from "@/shared/ui";

const VISIBLE_CHIPS = 3;

/** Shared grid template — used by both the list header and each desktop row. */
export const VED_GRID =
  "grid grid-cols-[minmax(140px,1.2fr)_minmax(80px,0.8fr)_minmax(100px,0.9fr)_minmax(90px,0.8fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(80px,0.6fr)_auto] gap-4 items-center";

interface VedAgentCardProps {
  agent: VedAgent;
}

/** Desktop table row (chromeless — placed inside the shared list container). */
export function VedAgentRow({ agent }: VedAgentCardProps) {
  const { ratingValue, reviewCount } = getVedAgentRating(agent.reviews);
  const commissionPrefix = agent.is_vip ? "От" : "До";

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
      <RatingBlock ratingValue={ratingValue} reviewCount={reviewCount} />
      <TelegramButton url={agent.url} className="justify-self-end" />
    </div>
  );
}

/** Mobile card. */
export function VedAgentCard({ agent }: VedAgentCardProps) {
  const { ratingValue, reviewCount } = getVedAgentRating(agent.reviews);
  const commissionPrefix = agent.is_vip ? "От" : "До";

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
        <RatingBlock ratingValue={ratingValue} reviewCount={reviewCount} compact />
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

      <ContactButton url={agent.url} />
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
      <span className="text-light-gray text-[10px] uppercase tracking-wide font-normal">
        {label}
      </span>
      <TagCell items={items} modalTitle={label} chip={chip} visibleCount={visibleCount} />
    </div>
  );
}

function MobileLimits({ limits }: { limits: VedAgent["limits"] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-2xs">
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
        <span className="text-light-gray">От</span>
        <span className="text-green-400 font-normal">{formatVedLimit(limits.from)}</span>
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
        <span className="text-light-gray">До</span>
        <span className="text-[#e8a090] font-normal">{formatVedLimit(limits.to)}</span>
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
      className="flex items-center justify-center gap-2 w-full rounded-[10px] bg-yellow-main text-black font-normal text-xs py-2.5 hover:bg-yellow-main/90 transition-colors"
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
      <Image
        src={agent.logo}
        alt={agent.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-lg object-contain bg-new-grey shrink-0"
      />
      <span className="font-medium lg:font-semibold text-white text-xs lg:text-base truncate">
        {agent.name}
      </span>
    </Link>
  );
}

function CommissionBadge({ prefix, value }: { prefix: string; value: number }) {
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-main/15 text-yellow-main text-2xs lg:text-xs whitespace-nowrap">
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
  ratingValue,
  reviewCount,
  compact,
}: {
  ratingValue: number;
  reviewCount: number;
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
      <span
        className={cn(
          "rounded-md bg-green-400/15 text-green-400",
          compact ? "px-1.5 py-0.5 text-[10px] font-normal" : "px-2 py-1 text-xs font-medium",
        )}
      >
        {reviewCount}
      </span>
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
