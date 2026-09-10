"use client";

import { FC } from "react";
import { PS_GRID, PS_MIN_WIDTH, PsCard, PsRow } from "@/widgets/payment-services/ps-card";
import { PaymentService } from "@/entities/strapi";
import { RatingsListShell } from "@/shared/ui";
import { PsSort, PsSortKey } from "../../ps-explorer/lib/filter";

interface PsListProps {
  services: PaymentService[];
  sort?: PsSort | null;
  onSort?: (key: PsSortKey) => void;
}

const HEADERS: { label: string; sortKey?: PsSortKey }[] = [
  { label: "Название" },
  { label: "Комиссия", sortKey: "commission" },
  { label: "Способ оплаты" },
  { label: "Сервисы и игры", sortKey: "platforms" },
  { label: "Валюты" },
  { label: "Рейтинг", sortKey: "rating" },
  { label: "" },
];

export const PsList: FC<PsListProps> = ({ services, sort, onSort }) => {
  return (
    <RatingsListShell
      grid={PS_GRID}
      minWidth={PS_MIN_WIDTH}
      headers={HEADERS}
      sort={sort}
      onSort={onSort}
      rows={services.map((service) => (
        <PsRow key={service.id} service={service} />
      ))}
      cards={services.map((service) => (
        <PsCard key={service.id} service={service} />
      ))}
    />
  );
};
