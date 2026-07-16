"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { ESIM_GRID, EsimCard, EsimRow } from "@/widgets/esim/esim-card";
import { Esim } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { EsimSort, EsimSortKey } from "../../esim-explorer/lib/filter";

interface EsimListProps {
  services: Esim[];
  sort?: EsimSort | null;
  onSort?: (key: EsimSortKey) => void;
}

/** Заголовки колонок. sortKey — только у сортируемых. */
const TABLE_HEADERS: { label: string; sortKey?: EsimSortKey }[] = [
  { label: "Название" },
  { label: "Метки" },
  { label: "Страны" },
  { label: "Цена за ГБ", sortKey: "price" },
  { label: "Объём", sortKey: "volume" },
  { label: "Срок", sortKey: "period" },
  { label: "Оплата" },
  // { label: "Отзывы" }, // ВРЕМЕННО скрыта колонка отзывов
  { label: "" },
];

export const EsimList: FC<EsimListProps> = ({ services, sort, onSort }) => {
  if (!services.length) {
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
              ESIM_GRID,
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
            {services.map((service) => (
              <EsimRow key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden grid gap-4">
        {services.map((service) => (
          <EsimCard key={service.id} service={service} />
        ))}
      </div>
    </>
  );
};
