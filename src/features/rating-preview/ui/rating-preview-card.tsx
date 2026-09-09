import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";
import { PreviewField, PreviewTag, RatingPreview } from "../model/types";

/** Больше трёх чипов в узкой карточке уже не помещается в строку. */
const VISIBLE_TAGS = 3;

interface RatingPreviewCardProps {
  preview: RatingPreview;
  /** Индекс в слайдере — задаёт лесенку появления. */
  index?: number;
  /**
   * Показатели, которые едут отдельным запросом (у обменников — направления и
   * резервы). Приходит уже обёрнутым в Suspense, поэтому карточка рисуется
   * сразу, а слот доезжает со своим скелетоном.
   */
  slot?: ReactNode;
}

/** Одна карточка для всех разделов: различия сущностей уже сняты адаптерами. */
export const RatingPreviewCard: FC<RatingPreviewCardProps> = ({ preview, index = 0, slot }) => {
  const tags = preview.tags ?? [];
  const visibleTags = tags.slice(0, VISIBLE_TAGS);
  const restTags = tags.length - visibleTags.length;

  return (
    <Link
      href={preview.href}
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className={cn(
        // w-full обязателен: CarouselItem — flex-контейнер, без него карточка
        // сжимается по содержимому и слайды получаются разной ширины
        "group relative grid grid-rows-[auto_1fr_auto] gap-3 h-full w-full min-w-0 p-4 mobile-xl:p-5",
        "rounded-[20px] border bg-new-dark-grey",
        "transition-[border-color,transform] duration-300",
        "hover:border-yellow-main/70 hover:-translate-y-0.5 active:scale-[0.99]",
        "animate-fade-in-up motion-reduce:animate-none motion-reduce:transition-none",
        preview.isVip ? "border-yellow-main/40" : "border-new-grey/60",
      )}
    >
      {preview.isVip && (
        <span className="absolute -top-2.5 right-4 z-10 rounded-[4px] bg-yellow-main px-2 py-1 text-[9px] font-bold uppercase text-black">
          Лучшее предложение
        </span>
      )}

      <div className="flex items-center gap-3 min-h-10 min-w-0">
        {preview.logo ? (
          <Image
            src={preview.logo}
            alt={preview.name}
            width={40}
            height={40}
            sizes="40px"
            className="size-10 shrink-0 rounded-full bg-new-grey object-contain"
          />
        ) : (
          <span className="grid place-items-center size-10 shrink-0 rounded-full bg-new-grey font-semibold text-yellow-main">
            {preview.name.charAt(0)}
          </span>
        )}
        <span className="grid min-w-0 gap-0.5">
          <span className="truncate text-sm font-semibold text-white transition-colors group-hover:text-yellow-main">
            {preview.name}
          </span>
          {preview.subtitle ? (
            <span className="truncate text-xs text-light-gray">{preview.subtitle}</span>
          ) : null}
        </span>
      </div>

      <div className="grid content-start gap-2 min-w-0">
        <div className="grid min-w-0 rounded-[12px] bg-new-grey/30 px-3 py-1">
          {preview.fields.map((field) => (
            <PreviewRow key={field.label} field={field} />
          ))}
          {slot}
        </div>

        {visibleTags.length > 0 && (
          <div className="grid gap-1.5 min-w-0">
            {preview.tagsLabel ? (
              <span className="text-[10px] uppercase tracking-wide text-light-gray/70">
                {preview.tagsLabel}
              </span>
            ) : null}
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {visibleTags.map((tag) => (
                <TagChip key={tag.id} tag={tag} />
              ))}
              {restTags > 0 ? (
                <span className="rounded-full bg-new-grey/50 px-2 py-1 text-2xs text-light-gray">
                  +{restTags}
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 min-w-0 border-t border-white/[0.06] pt-3">
        {preview.rating ? (
          <span className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-yellow-main">
              {preview.rating.toFixed(1)}
            </span>
            {preview.reviewsCount > 0 ? (
              <span className="truncate text-2xs text-light-gray">
                {preview.reviewsCount} отзывов
              </span>
            ) : null}
          </span>
        ) : (
          <span className="truncate text-2xs text-light-gray">
            {preview.reviewsCount > 0 ? `${preview.reviewsCount} отзывов` : ""}
          </span>
        )}
        <span className="shrink-0 text-xs font-medium text-yellow-main">Подробнее</span>
      </div>
    </Link>
  );
};

/**
 * Строка показателя: подпись слева, значение справа.
 * Экспортируется, чтобы догружаемые показатели выглядели так же, как основные.
 */
export const PreviewRow: FC<{ field: PreviewField }> = ({ field }) => (
  <span className="flex items-start justify-between gap-3 min-w-0 border-b border-white/[0.05] py-2 last:border-0">
    <span className="shrink-0 pt-px text-2xs text-light-gray">{field.label}</span>
    {/* Две строки, а не truncate: «До 100 000 бесплатно» в одну строку не влезает
        и обрывается на самом важном слове */}
    <span className="line-clamp-2 text-right text-xs font-medium text-white">{field.value}</span>
  </span>
);

/** Плейсхолдер строки на время догрузки — той же высоты, чтобы карточку не дёргало. */
export const PreviewRowSkeleton: FC<{ label: string }> = ({ label }) => (
  <span className="flex items-start justify-between gap-3 min-w-0 border-b border-white/[0.05] py-2 last:border-0">
    <span className="shrink-0 pt-px text-2xs text-light-gray">{label}</span>
    <span className="mt-0.5 h-3 w-14 animate-pulse rounded bg-new-grey" />
  </span>
);

const TagChip: FC<{ tag: PreviewTag }> = ({ tag }) => (
  <span className="flex items-center gap-1 rounded-full bg-new-grey/50 px-2 py-1 max-w-full min-w-0">
    {tag.icon ? (
      <Image
        src={tag.icon}
        alt=""
        width={12}
        height={12}
        sizes="12px"
        className="size-3 shrink-0 rounded-full object-contain"
      />
    ) : null}
    <span className="truncate text-2xs text-light-gray">{tag.title}</span>
  </span>
);
