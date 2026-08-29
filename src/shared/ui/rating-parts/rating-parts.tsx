import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { TagCell } from "../tag-cell/tag-cell";

/** Плашка «Лучшее предложение» над строкой таблицы или карточкой. */
export function VipBadge({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 bg-yellow-main text-black text-[9px] font-bold uppercase mobile-xl:px-3 px-2 py-1 lg:rounded-[0px] rounded-[4px] shadow-sm whitespace-nowrap pointer-events-none",
        className,
      )}
    >
      {label}
    </div>
  );
}

/** Пара «подпись — значение» в мобильной карточке. */
export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 rounded-[10px] bg-new-grey/40 px-2.5 py-2 min-w-0">
      <span className="text-light-gray text-[10px] uppercase tracking-wide truncate">{label}</span>
      {/* значения вроде «50 000 – 5 000 000 ₽» переносим, а не режем многоточием */}
      <span className="text-white text-xs font-medium leading-tight break-words">{value}</span>
    </div>
  );
}

/** Блок чипов с подписью в мобильной карточке. */
export function LabeledTags({
  label,
  items,
  chip,
}: {
  label: string;
  items: { id: number; title: string; icon?: string | null; code?: string }[];
  chip: "circle" | "icon" | "flag" | "code";
}) {
  if (!items?.length) return null;
  return (
    <div className="grid gap-1.5 min-w-0">
      <span className="text-light-gray text-[11px] uppercase tracking-wide font-medium">
        {label}
      </span>
      <TagCell
        items={items.map((item) => ({ ...item, icon: item.icon ?? undefined }))}
        modalTitle={label}
        chip={chip}
      />
    </div>
  );
}

/** Логотип + название (с ссылкой на деталь, если она есть). */
export function EntityIdentity({
  name,
  logo,
  href,
  subtitle,
  className,
}: {
  name: string;
  logo: string | null;
  href?: string;
  subtitle?: string | null;
  className?: string;
}) {
  const body = (
    <>
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-contain bg-new-grey shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-new-grey text-yellow-main font-semibold shrink-0">
          {name.charAt(0)}
        </div>
      )}
      <span className="grid min-w-0">
        <span className="font-semibold text-white text-sm lg:text-base truncate">{name}</span>
        {subtitle ? (
          <span className="text-light-gray text-xs truncate">{subtitle}</span>
        ) : null}
      </span>
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center gap-3 min-w-0", className)}>{body}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-3 min-w-0 hover:opacity-90", className)}>
      {body}
    </Link>
  );
}

/** Значение ячейки десктопной таблицы. */
export function ValueCell({ value, className }: { value: ReactNode; className?: string }) {
  return (
    <span className={cn("text-sm text-white min-w-0 truncate", className)} title={
      typeof value === "string" ? value : undefined
    }>
      {value}
    </span>
  );
}

/** Рейтинг и количество отзывов. */
export function RatingValue({
  rating,
  reviewsCount,
  compact,
}: {
  rating: number | null;
  reviewsCount?: number;
  compact?: boolean;
}) {
  if (!rating) {
    return <span className="text-light-gray text-sm">—</span>;
  }

  return (
    <span className={cn("grid min-w-0", compact ? "text-[11px]" : "text-sm")}>
      <span className="text-yellow-main font-semibold">{rating.toFixed(1)}</span>
      {reviewsCount ? (
        <span className="text-light-gray text-[10px] truncate">{reviewsCount} отзывов</span>
      ) : null}
    </span>
  );
}

/** Кнопки «Подробнее» и «Перейти» (в мобильной карточке — в столбик). */
export function ActionButtons({
  detailHref,
  url,
  actionLabel = "Перейти",
  detailLabel = "Подробнее",
  stacked,
  className,
}: {
  detailHref?: string;
  url: string;
  actionLabel?: string;
  detailLabel?: string;
  stacked?: boolean;
  className?: string;
}) {
  const detailLink = detailHref ? (
    <Link
      href={detailHref}
      className={cn(
        "text-center rounded-[10px] border border-[#575A62] text-white font-medium lg:font-normal text-[13px] lg:text-sm px-4 py-2.5 hover:border-yellow-main hover:text-yellow-main transition-colors",
        stacked ? "w-full" : "flex-1 lg:flex-none",
      )}
    >
      {detailLabel}
    </Link>
  ) : null;

  const actionLink = (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-center rounded-[10px] bg-yellow-main text-black font-medium text-[13px] lg:text-sm px-4 py-2.5 hover:bg-yellow-main/90 transition-colors whitespace-nowrap",
        stacked ? "w-full" : "flex-1 lg:flex-none",
      )}
    >
      {actionLabel}
    </Link>
  );

  return (
    <div
      className={cn(
        stacked ? "flex flex-col gap-2" : "flex items-center gap-2 justify-end",
        className,
      )}
    >
      {detailLink}
      {actionLink}
    </div>
  );
}

/** Пустая выдача — с кнопкой сброса, если фильтры активны. */
export function EmptyResult({
  active,
  emptyText,
  filteredText,
  onReset,
}: {
  active: boolean;
  emptyText: string;
  filteredText: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center py-10 px-4 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
      <p className="text-light-gray text-sm mobile-xl:text-base">
        {active ? filteredText : emptyText}
      </p>
      {active && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-yellow-main transition-opacity hover:opacity-80"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
