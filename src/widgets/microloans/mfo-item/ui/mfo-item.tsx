import {
  Microloan,
  formatApproval,
  formatFirstLoanType,
  formatMicroloanLimit,
  formatMicroloanTerm,
  orDash,
} from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  RatingValue,
  ValueCell,
  VipBadge,
} from "@/shared/ui";

/** Общая сетка десктопной таблицы — используется и шапкой списка, и строками. */
export const MFO_GRID =
  "grid grid-cols-[minmax(170px,1.3fr)_minmax(110px,0.9fr)_minmax(110px,0.9fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)_260px] gap-4 items-center";

export const MFO_MIN_WIDTH = "1240px";

interface MfoItemProps {
  loan: Microloan;
}

const detailHref = (slug: string) => `${routes.microloans}/${slug}`;

/** Строка десктопной таблицы. */
export function MfoRow({ loan }: MfoItemProps) {
  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        loan.is_vip && "bg-yellow-main/[0.05]",
        MFO_GRID,
      )}
    >
      {loan.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}

      <EntityIdentity name={loan.name} logo={loan.logo} href={detailHref(loan.slug)} />
      <ValueCell value={formatMicroloanLimit(loan)} />
      <ValueCell value={formatMicroloanTerm(loan)} />
      <ValueCell value={orDash(loan.rate)} />
      <ValueCell value={orDash(loan.psk)} />
      <ValueCell value={formatApproval(loan.approval)} />
      <RatingValue rating={loan.rating} reviewsCount={loan.reviews_count} />
      <ActionButtons detailHref={detailHref(loan.slug)} url={loan.url} actionLabel="Получить" />
    </div>
  );
}

/** Мобильная карточка. */
export function MfoCard({ loan }: MfoItemProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        loan.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {loan.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={loan.name}
          logo={loan.logo}
          href={detailHref(loan.slug)}
          className="flex-1"
        />
        <RatingValue rating={loan.rating} reviewsCount={loan.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Лимит" value={formatMicroloanLimit(loan)} />
        <Field label="Срок займа" value={formatMicroloanTerm(loan)} />
        <Field label="Ставка в день" value={orDash(loan.rate)} />
        <Field label="ПСК" value={orDash(loan.psk)} />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-light-gray">Первый займ</span>
        <span className="text-white text-right">{formatFirstLoanType(loan.first_loan_type)}</span>
      </div>

      <LabeledTags label="Получение денег" items={loan.issue_channels} chip="circle" />

      <ActionButtons
        detailHref={detailHref(loan.slug)}
        url={loan.url}
        actionLabel="Получить"
        stacked
      />
    </article>
  );
}
