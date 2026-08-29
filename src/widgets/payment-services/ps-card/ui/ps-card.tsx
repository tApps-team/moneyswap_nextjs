import { Gift } from "lucide-react";
import Link from "next/link";
import { PaymentService, formatCommission } from "@/entities/strapi";
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
export const PS_GRID =
  "grid grid-cols-[minmax(160px,1.4fr)_minmax(90px,0.7fr)_minmax(110px,0.9fr)_minmax(120px,1fr)_minmax(110px,0.9fr)_minmax(90px,0.7fr)_260px] gap-4 items-center";

export const PS_MIN_WIDTH = "1120px";

interface PsCardProps {
  service: PaymentService;
}

const detailHref = (slug: string) => `${routes.payment_services}/${slug}`;

const toTagItems = (items: { id: number; title: string; icon: string | null }[]) =>
  items.map((item) => ({ id: item.id, title: item.title, icon: item.icon ?? undefined }));

/** Строка десктопной таблицы. */
export function PsRow({ service }: PsCardProps) {
  return (
    <div
      className={cn(
        "relative px-5 py-4 transition-colors hover:bg-new-grey/30",
        service.is_vip && "bg-yellow-main/[0.05]",
        PS_GRID,
      )}
    >
      {service.is_vip && <VipBadge label="Лучшее предложение" className="-top-3 left-0" />}

      <EntityIdentity
        name={service.name}
        logo={service.logo}
        href={detailHref(service.slug)}
      />
      <ValueCell value={formatCommission(service)} />
      <TagCell
        items={toTagItems(service.payment_systems)}
        modalTitle="Способы оплаты"
        visibleCount={3}
        chip="icon"
        className="flex-nowrap"
      />
      <TagCell
        items={toTagItems(service.platforms)}
        modalTitle="Сервисы и игры"
        visibleCount={3}
        chip="icon"
        className="flex-nowrap"
      />
      <TagCell
        items={toTagItems(service.currencies).map((item, index) => ({
          ...item,
          code: service.currencies[index]?.code,
        }))}
        modalTitle="Валюты"
        visibleCount={3}
        chip="code"
        className="flex-nowrap"
      />
      <RatingValue rating={service.rating} reviewsCount={service.reviews_count} />

      <div className="flex items-center gap-2 justify-end">
        <ActionButtons detailHref={detailHref(service.slug)} url={service.url} />
      </div>
    </div>
  );
}

/** Мобильная карточка. */
export function PsCard({ service }: PsCardProps) {
  const hasPromo = (service.promocodes?.length ?? 0) > 0;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        service.is_vip ? "border border-yellow-main/40" : "border border-new-grey/50",
      )}
    >
      {service.is_vip && <VipBadge label="Лучшее предложение" className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={service.name}
          logo={service.logo}
          href={detailHref(service.slug)}
          className="flex-1"
        />
        <RatingValue rating={service.rating} reviewsCount={service.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Комиссия" value={formatCommission(service)} />
        <Field label="Сервисы и игры" value={`${service.platforms.length}`} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label="Способы оплаты" items={service.payment_systems} chip="icon" />
        <LabeledTags label="Сервисы и игры" items={service.platforms} chip="icon" />
        <LabeledTags
          label="Валюты"
          items={service.currencies.map((currency) => ({
            id: currency.id,
            title: currency.title,
            icon: currency.icon,
            code: currency.code,
          }))}
          chip="code"
        />
      </div>

      {hasPromo ? (
        <Link
          href={detailHref(service.slug)}
          className="flex items-center justify-center gap-1.5 rounded-[10px] bg-new-grey text-yellow-main text-[13px] font-medium px-4 py-2.5 transition-colors hover:bg-yellow-main hover:text-black"
        >
          <Gift className="w-3.5 h-3.5" />
          Бонусы и промокоды
        </Link>
      ) : null}

      <ActionButtons detailHref={detailHref(service.slug)} url={service.url} stacked />
    </article>
  );
}
