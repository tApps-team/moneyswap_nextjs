import { FC, ReactNode } from "react";
import {
  DebitCard,
  formatCardCategory,
  formatCardRating,
  formatReviewsCount,
  orDash,
} from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

interface DebitCardSpecsTableProps {
  card: DebitCard;
}

const toTagItems = (items: { id: number; title: string; icon: string | null }[]) =>
  items.map((item) => ({ id: item.id, title: item.title, icon: item.icon ?? undefined }));

/** Таблица условий дебетовой карты на детальной странице (справа, sticky на десктопе). */
export const DebitCardSpecsTable: FC<DebitCardSpecsTableProps> = ({ card }) => {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Банк", value: orDash(card.bank?.title) },
    { label: "Обслуживание", value: orDash(card.service_cost) },
    { label: "Лимит переводов", value: orDash(card.transfer_limit) },
    { label: "Кэшбэк", value: orDash(card.cashback) },
    { label: "% на остаток", value: orDash(card.percent_on_balance) },
    { label: "Категория", value: formatCardCategory(card.card_category) },
    {
      label: "Платёжная система",
      value: (
        <TagCell
          items={toTagItems(card.payment_systems)}
          modalTitle="Платёжная система"
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: "Особенности",
      value: (
        <TagCell
          items={toTagItems(card.features)}
          modalTitle="Особенности"
          chip="circle"
          className="justify-end"
        />
      ),
    },
    {
      label: "Бонусы",
      value: (
        <TagCell
          items={toTagItems(card.bonuses)}
          modalTitle="Бонусы"
          chip="circle"
          className="justify-end"
        />
      ),
    },
    { label: "Город", value: orDash(card.city) },
    {
      label: "Рейтинг",
      value: card.rating ? (
        <span className="flex items-center gap-2 justify-end">
          <span className="text-yellow-main font-semibold">{formatCardRating(card.rating)}</span>
          {card.reviews_count ? (
            <span className="text-light-gray text-xs">
              {formatReviewsCount(card.reviews_count)}
            </span>
          ) : null}
        </span>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] overflow-hidden">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex items-center justify-between gap-4 px-5 mobile-xl:px-6 py-4 min-w-0 ${
            index < rows.length - 1 ? "border-b border-[#575A62]/40" : ""
          }`}
        >
          <span className="text-sm text-light-gray shrink-0">{row.label}</span>
          <div className="text-sm text-white text-right min-w-0">{row.value}</div>
        </div>
      ))}
    </div>
  );
};
