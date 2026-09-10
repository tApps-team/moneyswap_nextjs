"use client";

import { FC } from "react";
import {
  CREDIT_CARD_GRID,
  CREDIT_CARD_MIN_WIDTH,
  CreditCardCard,
  CreditCardRow,
} from "@/widgets/cards/credit-card-item";
import { CreditCard } from "@/entities/strapi";
import { RatingsListShell } from "@/shared/ui";
import { CreditCardSort, CreditCardSortKey } from "../../credit-cards-explorer/lib/filter";

interface CreditCardsListProps {
  cards: CreditCard[];
  sort?: CreditCardSort | null;
  onSort?: (key: CreditCardSortKey) => void;
}

const HEADERS: { label: string; sortKey?: CreditCardSortKey }[] = [
  { label: "Название" },
  { label: "Обслуживание", sortKey: "service" },
  { label: "Льготный период", sortKey: "grace" },
  { label: "Кредитный лимит", sortKey: "limit" },
  { label: "Ставка", sortKey: "rate" },
  { label: "Особенности" },
  { label: "Рейтинг", sortKey: "rating" },
  { label: "" },
];

export const CreditCardsList: FC<CreditCardsListProps> = ({ cards, sort, onSort }) => {
  return (
    <RatingsListShell
      grid={CREDIT_CARD_GRID}
      minWidth={CREDIT_CARD_MIN_WIDTH}
      headers={HEADERS}
      sort={sort}
      onSort={onSort}
      rows={cards.map((card) => (
        <CreditCardRow key={card.id} card={card} />
      ))}
      cards={cards.map((card) => (
        <CreditCardCard key={card.id} card={card} />
      ))}
    />
  );
};
