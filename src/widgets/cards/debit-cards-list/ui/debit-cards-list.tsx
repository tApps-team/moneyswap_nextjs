"use client";

import { FC } from "react";
import {
  DEBIT_CARD_GRID,
  DEBIT_CARD_MIN_WIDTH,
  DebitCardCard,
  DebitCardRow,
} from "@/widgets/cards/debit-card-item";
import { DebitCard } from "@/entities/strapi";
import { RatingsListShell } from "@/shared/ui";
import { DebitCardSort, DebitCardSortKey } from "../../debit-cards-explorer/lib/filter";

interface DebitCardsListProps {
  cards: DebitCard[];
  sort?: DebitCardSort | null;
  onSort?: (key: DebitCardSortKey) => void;
}

const HEADERS: { label: string; sortKey?: DebitCardSortKey }[] = [
  { label: "Название" },
  { label: "Обслуживание", sortKey: "service" },
  { label: "Лимит переводов" },
  { label: "Кэшбэк", sortKey: "cashback" },
  { label: "% на остаток", sortKey: "percent" },
  { label: "Особенности" },
  { label: "Рейтинг", sortKey: "rating" },
  { label: "" },
];

export const DebitCardsList: FC<DebitCardsListProps> = ({ cards, sort, onSort }) => {
  return (
    <RatingsListShell
      grid={DEBIT_CARD_GRID}
      minWidth={DEBIT_CARD_MIN_WIDTH}
      headers={HEADERS}
      sort={sort}
      onSort={onSort}
      rows={cards.map((card) => (
        <DebitCardRow key={card.id} card={card} />
      ))}
      cards={cards.map((card) => (
        <DebitCardCard key={card.id} card={card} />
      ))}
    />
  );
};
