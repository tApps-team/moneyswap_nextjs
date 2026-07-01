import { FC } from "react";
import { VC_GRID, VcCard, VcRow } from "@/widgets/vc/vc-card";
import { VirtualCard } from "@/entities/strapi";
import { cn } from "@/shared/lib";

interface VcListProps {
  cards: VirtualCard[];
}

const TABLE_HEADERS = [
  "Название",
  "Выпуск карты",
  "Обслуживание",
  "Комиссия пополнения",
  "Сервисы",
  // "Отзывы", // ВРЕМЕННО скрыта колонка отзывов
  "Обзор и промокоды",
] as const;

export const VcList: FC<VcListProps> = ({ cards }) => {
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
            {TABLE_HEADERS.map((header, index) => (
              <span key={`header-${index}`}>{header}</span>
            ))}
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
