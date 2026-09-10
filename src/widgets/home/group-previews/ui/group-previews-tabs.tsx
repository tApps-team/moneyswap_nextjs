"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import { RatingPreview } from "@/features/rating-preview";
import { SECTION_BY_KEY, SiteSectionKey } from "@/shared/consts";
import { cn } from "@/shared/lib";
import { Reveal } from "@/shared/ui";
import { PreviewsSlider } from "../../previews-slider";

export interface GroupPreviewTab {
  key: string;
  title: string;
  href: string;
  previews: RatingPreview[];
  /** Догружаемые показатели по id превью — см. PreviewsSlider. */
  slots?: Record<string, ReactNode>;
}

interface GroupPreviewsTabsProps {
  title: string;
  subtitle: string;
  groupHref: string;
  tabs: GroupPreviewTab[];
  /** Подпись ссылки в шапке полки: у полки одного раздела «разделов» нет. */
  groupLabel?: string;
  /** Подпись последнего слайда-ссылки. */
  allLabel?: string;
}

/**
 * Полка одной группы разделов.
 * Данные всех вкладок уже пришли с сервера, поэтому переключение мгновенное
 * и не требует запросов. С одной вкладкой ряд табов не рисуется — так же
 * выглядят полки отдельных разделов.
 */
export const GroupPreviewsTabs: FC<GroupPreviewsTabsProps> = ({
  title,
  subtitle,
  groupHref,
  tabs,
  groupLabel = "Все разделы",
  allLabel,
}) => {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  if (!active) return null;

  return (
    <Reveal className="grid gap-5 min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3 min-w-0">
        <div className="grid gap-1.5 min-w-0">
          <h2 className="unbounded_font uppercase text-yellow-main mobile-xl:text-xl text-base font-semibold leading-tight">
            {title}
          </h2>
          <p className="text-light-gray mobile-xl:text-sm text-xs leading-snug max-w-2xl">
            {subtitle}
          </p>
        </div>

        <Link
          href={groupHref}
          className="group hidden mobile-xl:flex items-center gap-2 shrink-0 text-sm text-yellow-main transition-colors hover:opacity-80"
        >
          {groupLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar min-w-0 -mx-1 px-1 py-0.5">
          {tabs.map((tab) => {
            const Icon = SECTION_BY_KEY[tab.key as SiteSectionKey]?.icon;
            const isActive = tab.key === active.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                aria-pressed={isActive}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-[12px] border px-3.5 py-2 mobile-xl:px-4",
                  "text-xs mobile-xl:text-sm font-medium",
                  "transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98]",
                  isActive
                    ? "border-yellow-main bg-yellow-main text-black"
                    : "border-new-grey/60 bg-new-dark-grey text-light-gray hover:border-yellow-main/50 hover:text-white",
                )}
              >
                {Icon ? (
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive ? "text-black" : "text-yellow-main/80",
                    )}
                  />
                ) : null}
                {tab.title}
              </button>
            );
          })}
        </div>
      )}

      <PreviewsSlider
        previews={active.previews}
        href={active.href}
        allLabel={allLabel}
        slots={active.slots}
      />
    </Reveal>
  );
};
