import { FC } from "react";
import { ESIM_GRID, EsimCard, EsimRow } from "@/widgets/esim/esim-card";
import { Esim } from "@/entities/strapi";
import { cn } from "@/shared/lib";

interface EsimListProps {
  services: Esim[];
}

const TABLE_HEADERS = [
  "Название",
  "Метки",
  "Страны",
  "Цена",
  "Объём",
  "Срок",
  "Оплата",
  "Отзывы",
  "",
] as const;

export const EsimList: FC<EsimListProps> = ({ services }) => {
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
            {TABLE_HEADERS.map((header, index) => (
              <span key={`header-${index}`}>{header}</span>
            ))}
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
