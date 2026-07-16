import { Check, X } from "lucide-react";
import { FC, ReactNode } from "react";
import {
  Esim,
  formatEsimPrice,
  formatEsimValidityPeriod,
  formatEsimVolume,
  getEsimReviewBreakdown,
} from "@/entities/strapi";
import { TagCell } from "@/shared/ui";

const BoolCell: FC<{ active: boolean }> = ({ active }) =>
  active ? (
    <Check className="w-5 h-5 text-green-400 ml-auto" strokeWidth={2.5} />
  ) : (
    <X className="w-5 h-5 text-red-500 ml-auto" strokeWidth={2.5} />
  );

interface EsimSpecsTableProps {
  service: Esim;
}

export const EsimSpecsTable: FC<EsimSpecsTableProps> = ({ service }) => {
  const breakdown = getEsimReviewBreakdown(service.reviews);

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Цена за ГБ", value: formatEsimPrice(service.connection_price) },
    { label: "Объем интернета", value: formatEsimVolume(service.internet_volume) },
    { label: "Срок действия", value: formatEsimValidityPeriod(service.validity_period) },
    {
      label: "Раздача интернета",
      value: <BoolCell active={service.internet_sharing === "with_sharing"} />,
    },
    { label: "Звонки", value: <BoolCell active={service.calls === "with_calls"} /> },
    { label: "Возможность пополнения", value: <BoolCell active={service.top_up === "with_top_up"} /> },
    {
      label: "Страны",
      value: (
        <TagCell
          items={service.countries}
          modalTitle="Страны"
          chip="flag"
          className="justify-end"
        />
      ),
    },
    {
      label: "Рейтинг",
      value: (
        <div className="flex items-center gap-1.5 justify-end text-xs mobile-xl:text-sm font-medium">
          <span className="text-green-400">{breakdown.positive}</span>
          <span className="text-yellow-main">{breakdown.neutral}</span>
          <span className="text-red-500">{breakdown.negative}</span>
        </div>
      ),
    },
    {
      label: "Метки",
      value: (
        <TagCell
          items={service.labels}
          modalTitle="Метки"
          chip="circle"
          className="justify-end"
        />
      ),
    },
    {
      label: "Способы оплаты",
      value: (
        <TagCell
          items={service.payment_systems}
          modalTitle="Способы оплаты"
          chip="icon"
          className="justify-end"
        />
      ),
    },
  ];

  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] overflow-hidden">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex items-center justify-between gap-4 px-5 mobile-xl:px-6 py-4 ${
            index < rows.length - 1 ? "border-b border-[#575A62]/40" : ""
          }`}
        >
          <span className="text-sm text-light-gray shrink-0">{row.label}</span>
          <div className="text-sm text-white text-right">{row.value}</div>
        </div>
      ))}
    </div>
  );
};
