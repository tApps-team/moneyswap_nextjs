import { BankCredit, orDash } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  RatingValue,
  ValueCell,
  VipBadge,
} from "@/shared/ui";

/** Общая сетка десктопной таблицы — используется и шапкой списка, и строками. */
export const CREDIT_GRID =
  "grid grid-cols-[minmax(180px,1.4fr)_minmax(120px,1fr)_minmax(110px,0.9fr)_minmax(160px,1.2fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)_260px] gap-4 items-center";

export const CREDIT_MIN_WIDTH = "1120px";

interface CreditItemProps {
  credit: BankCredit;
}

const detailHref = (slug: string) => `${routes.credits}/${slug}`;

/** Строка десктопной таблицы. */
export function CreditRow({ credit }: CreditItemProps) {
  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        credit.is_vip && "bg-yellow-main/[0.05]",
        CREDIT_GRID,
      )}
    >
      {credit.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}

      <EntityIdentity
        name={credit.bank?.title ?? credit.name}
        logo={credit.logo ?? credit.bank?.logo ?? null}
        subtitle={credit.name}
        href={detailHref(credit.slug)}
      />
      <ValueCell value={orDash(credit.psk)} />
      <ValueCell value={orDash(credit.rate)} />
      <ValueCell value={orDash(credit.amount)} />
      <ValueCell value={orDash(credit.term)} />
      <RatingValue rating={credit.rating} />
      <ActionButtons
        detailHref={detailHref(credit.slug)}
        url={credit.url}
        actionLabel="Оформить"
      />
    </div>
  );
}

/** Мобильная карточка. */
export function CreditCardItem({ credit }: CreditItemProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        credit.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {credit.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={credit.bank?.title ?? credit.name}
          logo={credit.logo ?? credit.bank?.logo ?? null}
          subtitle={credit.name}
          href={detailHref(credit.slug)}
          className="flex-1"
        />
        <RatingValue rating={credit.rating} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Ставка" value={orDash(credit.rate)} />
        <Field label="ПСК" value={orDash(credit.psk)} />
        <Field label="Сумма" value={orDash(credit.amount)} />
        <Field label="Срок" value={orDash(credit.term)} />
      </div>

      <ActionButtons
        detailHref={detailHref(credit.slug)}
        url={credit.url}
        actionLabel="Оформить"
        stacked
      />
    </article>
  );
}
