import { FC, ReactNode } from "react";
import { PaymentService, formatCommission, formatReviewsCount } from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

interface PsSpecsTableProps {
  service: PaymentService;
}

/** Таблица характеристик сервиса на детальной странице (справа, sticky на десктопе). */
export const PsSpecsTable: FC<PsSpecsTableProps> = ({ service }) => {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Комиссия", value: formatCommission(service) },
    {
      label: "Способы оплаты",
      value: (
        <TagCell
          items={service.payment_systems.map((method) => ({
            id: method.id,
            title: method.title,
            icon: method.icon ?? undefined,
          }))}
          modalTitle="Способы оплаты"
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: "Валюты",
      value: (
        <TagCell
          items={service.currencies.map((currency) => ({
            id: currency.id,
            title: currency.title,
            icon: currency.icon ?? undefined,
            code: currency.code,
          }))}
          modalTitle="Валюты"
          chip="code"
          className="justify-end"
        />
      ),
    },
    {
      label: "Сервисы и игры",
      value: (
        <TagCell
          items={service.platforms.map((platform) => ({
            id: platform.id,
            title: platform.title,
            icon: platform.icon ?? undefined,
          }))}
          modalTitle="Сервисы и игры"
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: "Рейтинг",
      value: service.rating ? (
        <span className="flex items-center gap-2 justify-end">
          <span className="text-yellow-main font-semibold">{service.rating.toFixed(1)}</span>
          {service.reviews_count ? (
            <span className="text-light-gray text-xs">
              {formatReviewsCount(service.reviews_count)}
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
