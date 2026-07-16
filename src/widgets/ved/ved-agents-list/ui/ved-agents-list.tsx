"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { VED_GRID, VedAgentCard, VedAgentRow } from "@/widgets/ved/ved-agent-card";
import { VedAgent } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { VedSort, VedSortKey } from "../../ved-agents-explorer/lib/filter";

interface VedAgentsListProps {
  agents: VedAgent[];
  sort?: VedSort | null;
  onSort?: (key: VedSortKey) => void;
}

/** Заголовки колонок. sortKey — только у сортируемых. */
const TABLE_HEADERS: { label: string; sortKey?: VedSortKey }[] = [
  { label: "Агент" },
  { label: "Метки" },
  { label: "Страны" },
  { label: "Валюты" },
  { label: "Комиссия", sortKey: "commission" },
  { label: "Лимиты перевода USD", sortKey: "limitFrom" },
  // { label: "Отзывы" }, // ВРЕМЕННО скрыта колонка отзывов
  { label: "" },
];

export const VedAgentsList: FC<VedAgentsListProps> = ({ agents, sort, onSort }) => {
  if (!agents.length) {
    return (
      <p className="text-center text-light-gray py-10 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
        Агенты пока не добавлены
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-[20px] border border-new-grey/60 bg-new-dark-grey scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
        <div className="min-w-[1080px]">
          <div
            className={cn(
              VED_GRID,
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
            {agents.map((agent) => (
              <VedAgentRow key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden grid gap-4">
        {agents.map((agent) => (
          <VedAgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </>
  );
};
