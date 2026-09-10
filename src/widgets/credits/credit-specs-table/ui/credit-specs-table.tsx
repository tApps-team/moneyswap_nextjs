import { FC, ReactNode } from "react";
import { BankCredit, orDash } from "@/entities/strapi";

interface CreditSpecsTableProps {
  credit: BankCredit;
}

/** Таблица условий кредита на детальной странице. */
export const CreditSpecsTable: FC<CreditSpecsTableProps> = ({ credit }) => {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Банк", value: orDash(credit.bank?.title) },
    { label: "Сумма", value: orDash(credit.amount) },
    { label: "Срок", value: orDash(credit.term) },
    { label: "Ставка", value: orDash(credit.rate) },
    { label: "ПСК", value: orDash(credit.psk) },
    {
      label: "Рейтинг",
      value: credit.rating ? (
        <span className="text-yellow-main font-semibold">{credit.rating.toFixed(1)}</span>
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
          <div className="text-sm text-white text-right min-w-0 truncate">{row.value}</div>
        </div>
      ))}
    </div>
  );
};
