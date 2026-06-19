import { FC } from "react";
import { VED_GRID, VedAgentCard, VedAgentRow } from "@/widgets/ved/ved-agent-card";
import { VedAgent } from "@/entities/strapi";
import { cn } from "@/shared/lib";

interface VedAgentsListProps {
  agents: VedAgent[];
}

const TABLE_HEADERS = [
  "Агент",
  "Метки",
  "Страны",
  "Валюты",
  "Комиссия",
  "Лимиты перевода USD",
  "Отзывы",
  "",
] as const;

export const VedAgentsList: FC<VedAgentsListProps> = ({ agents }) => {
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
            {TABLE_HEADERS.map((header, index) => (
              <span key={`header-${index}`}>{header}</span>
            ))}
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
