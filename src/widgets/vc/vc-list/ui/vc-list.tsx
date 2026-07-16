"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { VC_GRID, VcCard, VcRow } from "@/widgets/vc/vc-card";
import { VirtualCard } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { VcSort, VcSortKey } from "../../vc-explorer/lib/filter";

interface VcListProps {
  cards: VirtualCard[];
  sort?: VcSort | null;
  onSort?: (key: VcSortKey) => void;
}

/** Заголовки колонок. sortKey — только у сортируемых. */
const TABLE_HEADERS: { label: string; sortKey?: VcSortKey }[] = [
  { label: "Название" },
  { label: "Выпуск карты", sortKey: "issuance" },
  { label: "Обслуживание" },
  { label: "Комиссия пополнения", sortKey: "topup" },
  { label: "Сервисы" },
  // { label: "Отзывы" }, // ВРЕМЕННО скрыта колонка отзывов
  { label: "Обзор и промокоды" },
];

export const VcList: FC<VcListProps> = ({ cards, sort, onSort }) => {
  if (!cards.length) {
    return (
      <p className="text-center text-light-gray py-10 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
        В этой категории пока нет сервисов
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-[20px] border border-new-grey/60 bg-new-dark-grey scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
        <div className="min-w-[1120px]">
          <div
            className={cn(
              VC_GRID,
              "px-5 py-4 text-2xs text-light-gray uppercase tracking-wide bg-new-grey/30",
            )}
          >
            {TABLE_HEADERS.map((header, index) => {
              if (!header.sortKey || !onSort) {
                return <span key={`header-${index}`}>{header.label}</span>;
              }

              const activeSort = sort?.key === header.sortKey;
              return (
                <button
                  key={`header-${index}`}
                  type="button"
                  onClick={() => onSort(header.sortKey!)}
                  className={cn(
                    "flex items-center gap-1 uppercase text-left transition-colors hover:text-white",
                    activeSort && "text-yellow-main",
                  )}
                >
                  {header.label}
                  {activeSort ? (
                    sort?.dir === "asc" ? (
                      <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 shrink-0" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="divide-y divide-white/[0.06] pt-3">
            {cards.map((card) => (
              <VcRow key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden grid gap-4">
        {cards.map((card) => (
          <VcCard key={card.id} card={card} />
        ))}
      </div>
    </>
  );
};
