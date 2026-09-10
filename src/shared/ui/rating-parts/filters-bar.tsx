"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/shared/lib";

interface FiltersBarProps {
  /** Строка поиска — на мобильном стоит отдельно, на десктопе входит в общий ряд. */
  search?: ReactNode;
  /** Сколько фильтров сейчас выбрано — показывается на кнопке «Фильтры» (поиск не считаем). */
  activeCount?: number;
  /** Показывать ли «Сбросить». По умолчанию — когда выбран хотя бы один фильтр. */
  canReset?: boolean;
  onReset?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Панель фильтров раздела-рейтинга.
 * На мобильном виден только поиск и кнопка «Фильтры» — сами фильтры разворачиваются
 * по клику, чтобы список не уезжал вниз экрана. С md всё лежит в одном ряду.
 */
export function FiltersBar({
  search,
  activeCount = 0,
  canReset,
  onReset,
  children,
  className,
}: FiltersBarProps) {
  const [open, setOpen] = useState(false);
  const showReset = (canReset ?? activeCount > 0) && Boolean(onReset);

  return (
    <div className={cn("grid gap-3 min-w-0", className)}>
      {/* Мобильная строка: поиск + переключатель фильтров */}
      <div className="flex items-center gap-3 min-w-0 md:hidden">
        {search}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn(
            "flex items-center gap-2 h-12 shrink-0 px-4 rounded-[14px] border text-sm transition-colors",
            open || activeCount > 0
              ? "border-yellow-main/70 bg-yellow-main/10 text-yellow-main"
              : "border-new-grey/60 bg-new-dark-grey text-light-gray",
          )}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          {/* на самых узких экранах оставляем только иконку, чтобы поиск не сжимался */}
          <span className="hidden mobile:inline">Фильтры</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-yellow-main text-black text-2xs font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/*
        Сами фильтры: на мобильном скрыты до раскрытия и идут колонкой,
        на планшете — в две колонки (иначе каждый занимает всю ширину),
        с lg — обычный ряд с переносом.
      */}
      <div
        className={cn(
          "gap-x-4 gap-y-3 min-w-0",
          open ? "flex flex-col" : "hidden",
          "md:grid md:grid-cols-2 md:items-center",
          "lg:flex lg:flex-row lg:flex-wrap lg:items-center",
        )}
      >
        {children}

        <div className="hidden md:block md:flex-1 md:min-w-[220px]">{search}</div>

        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 h-12 px-1 self-start md:self-auto text-sm text-light-gray transition-colors hover:text-yellow-main"
          >
            Сбросить
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ResetFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 h-12 px-1 self-start md:self-auto text-sm text-light-gray transition-colors hover:text-yellow-main"
    >
      Сбросить
      <X className="w-4 h-4" />
    </button>
  );
}
