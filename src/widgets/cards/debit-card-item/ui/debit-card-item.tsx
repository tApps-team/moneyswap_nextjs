import { DebitCard, formatCardCategory, orDash } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  RatingValue,
  TagCell,
  ValueCell,
  VipBadge,
} from "@/shared/ui";

/** Общая сетка десктопной таблицы — используется и шапкой списка, и строками. */
export const DEBIT_CARD_GRID =
  "grid grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(90px,0.7fr)_minmax(100px,0.8fr)_minmax(120px,1fr)_minmax(80px,0.6fr)_260px] gap-4 items-center";

export const DEBIT_CARD_MIN_WIDTH = "1260px";

interface DebitCardItemProps {
  card: DebitCard;
}

const toTagItems = (items: { id: number; title: string; icon: string | null }[]) =>
  items.map((item) => ({ id: item.id, title: item.title, icon: item.icon ?? undefined }));

const detailHref = (slug: string) => `${routes.debit_cards}/${slug}`;

/** Строка десктопной таблицы. */
export function DebitCardRow({ card }: DebitCardItemProps) {
  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        card.is_vip && "bg-yellow-main/[0.05]",
        DEBIT_CARD_GRID,
      )}
    >
      {card.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}

      <EntityIdentity
        name={card.name}
        logo={card.logo}
        subtitle={card.bank?.title}
        href={detailHref(card.slug)}
      />
      <ValueCell value={orDash(card.service_cost)} />
      <ValueCell value={orDash(card.transfer_limit)} />
      <ValueCell value={orDash(card.cashback)} />
      <ValueCell value={orDash(card.percent_on_balance)} />
      <TagCell
        items={toTagItems(card.features)}
        modalTitle="Особенности"
        visibleCount={2}
        chip="circle"
        className="flex-nowrap"
      />
      <RatingValue rating={card.rating} />
      <ActionButtons detailHref={detailHref(card.slug)} url={card.url} actionLabel="Оформить" />
    </div>
  );
}

/** Мобильная карточка. */
export function DebitCardCard({ card }: DebitCardItemProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        card.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {card.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={card.name}
          logo={card.logo}
          subtitle={card.bank?.title}
          href={detailHref(card.slug)}
          className="flex-1"
        />
        <RatingValue rating={card.rating} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Обслуживание" value={orDash(card.service_cost)} />
        <Field label="Лимит переводов" value={orDash(card.transfer_limit)} />
        <Field label="Кэшбэк" value={orDash(card.cashback)} />
        <Field label="% на остаток" value={orDash(card.percent_on_balance)} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label="Особенности" items={card.features} chip="circle" />
        <LabeledTags label="Бонусы" items={card.bonuses} chip="circle" />
        <LabeledTags label="Платёжная система" items={card.payment_systems} chip="icon" />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-light-gray">
        <span>Категория</span>
        <span className="text-white">{formatCardCategory(card.card_category)}</span>
      </div>

      <ActionButtons
        detailHref={detailHref(card.slug)}
        url={card.url}
        actionLabel="Оформить"
        stacked
      />
    </article>
  );
}
