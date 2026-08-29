"use client";

import { FC } from "react";
import {
  CREDIT_GRID,
  CREDIT_MIN_WIDTH,
  CreditCardItem,
  CreditRow,
} from "@/widgets/credits/credit-item";
import { BankCredit } from "@/entities/strapi";
import { RatingsListShell } from "@/shared/ui";
import { CreditsSort, CreditsSortKey } from "../../credits-explorer/lib/filter";

interface CreditsListProps {
  credits: BankCredit[];
  sort?: CreditsSort | null;
  onSort?: (key: CreditsSortKey) => void;
}

const HEADERS: { label: string; sortKey?: CreditsSortKey }[] = [
  { label: "Банк" },
  { label: "ПСК" },
  { label: "Ставка", sortKey: "rate" },
  { label: "Сумма", sortKey: "amount" },
  { label: "Срок", sortKey: "term" },
  { label: "Рейтинг", sortKey: "rating" },
  { label: "" },
];

export const CreditsList: FC<CreditsListProps> = ({ credits, sort, onSort }) => {
  return (
    <RatingsListShell
      grid={CREDIT_GRID}
      minWidth={CREDIT_MIN_WIDTH}
      headers={HEADERS}
      sort={sort}
      onSort={onSort}
      rows={credits.map((credit) => (
        <CreditRow key={credit.id} credit={credit} />
      ))}
      cards={credits.map((credit) => (
        <CreditCardItem key={credit.id} credit={credit} />
      ))}
    />
  );
};
