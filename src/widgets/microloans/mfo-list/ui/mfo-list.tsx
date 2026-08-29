"use client";

import { FC } from "react";
import { MFO_GRID, MFO_MIN_WIDTH, MfoCard, MfoRow } from "@/widgets/microloans/mfo-item";
import { Microloan } from "@/entities/strapi";
import { RatingsListShell } from "@/shared/ui";
import { MfoSort, MfoSortKey } from "../../mfo-explorer/lib/filter";

interface MfoListProps {
  loans: Microloan[];
  sort?: MfoSort | null;
  onSort?: (key: MfoSortKey) => void;
}

const HEADERS: { label: string; sortKey?: MfoSortKey }[] = [
  { label: "МФО" },
  { label: "Лимит", sortKey: "limit" },
  { label: "Срок займа", sortKey: "term" },
  { label: "Ставка в день", sortKey: "rate" },
  { label: "ПСК" },
  { label: "Одобрение" },
  { label: "Рейтинг", sortKey: "rating" },
  { label: "" },
];

export const MfoList: FC<MfoListProps> = ({ loans, sort, onSort }) => {
  return (
    <RatingsListShell
      grid={MFO_GRID}
      minWidth={MFO_MIN_WIDTH}
      headers={HEADERS}
      sort={sort}
      onSort={onSort}
      rows={loans.map((loan) => (
        <MfoRow key={loan.id} loan={loan} />
      ))}
      cards={loans.map((loan) => (
        <MfoCard key={loan.id} loan={loan} />
      ))}
    />
  );
};
