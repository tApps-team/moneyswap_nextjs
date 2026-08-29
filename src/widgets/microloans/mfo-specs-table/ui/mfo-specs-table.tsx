import { FC, ReactNode } from "react";
import {
  Microloan,
  formatApproval,
  formatDurationType,
  formatFirstLoanType,
  formatLimitType,
  formatMicroloanLimit,
  formatMicroloanTerm,
  formatVerificationStatus,
  orDash,
} from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

interface MfoSpecsTableProps {
  loan: Microloan;
}

/** Таблица условий займа на детальной странице. */
export const MfoSpecsTable: FC<MfoSpecsTableProps> = ({ loan }) => {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Лимит", value: formatMicroloanLimit(loan) },
    { label: "Срок займа", value: formatMicroloanTerm(loan) },
    { label: "Ставка в день", value: orDash(loan.rate) },
    { label: "ПСК", value: orDash(loan.psk) },
    { label: "Одобрение", value: formatApproval(loan.approval) },
    { label: "Первый займ", value: formatFirstLoanType(loan.first_loan_type) },
    { label: "Тип лимита", value: formatLimitType(loan.loan_limit_type) },
    { label: "Тип срока", value: formatDurationType(loan.loan_duration_type) },
    { label: "Проверка условий", value: formatVerificationStatus(loan.verification_status) },
    {
      label: "Получение денег",
      value: (
        <TagCell
          items={loan.issue_channels.map((channel) => ({
            id: channel.id,
            title: channel.title,
            icon: channel.icon ?? undefined,
          }))}
          modalTitle="Получение денег"
          chip="circle"
          className="justify-end"
        />
      ),
    },
    {
      label: "Рейтинг",
      value: loan.rating ? (
        <span className="flex items-center gap-2 justify-end">
          <span className="text-yellow-main font-semibold">{loan.rating.toFixed(1)}</span>
          {loan.reviews_count ? (
            <span className="text-light-gray text-xs">{loan.reviews_count} отзывов</span>
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
