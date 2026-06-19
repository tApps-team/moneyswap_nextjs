import { Star } from "lucide-react";
import Image from "next/image";
import { FC, ReactNode } from "react";
import {
  Esim,
  formatEsimCalls,
  formatEsimInternetSharing,
  formatEsimPrice,
  formatEsimTopUp,
  formatEsimValidityPeriod,
  formatEsimVolume,
  getEsimRating,
  getEsimReviewBreakdown,
} from "@/entities/strapi";

const VISIBLE_CHIPS = 3;

interface EsimSpecsTableProps {
  service: Esim;
}

export const EsimSpecsTable: FC<EsimSpecsTableProps> = ({ service }) => {
  const { ratingValue } = getEsimRating(service.reviews);
  const displayRating = ratingValue || service.rating || 0;
  const breakdown = getEsimReviewBreakdown(service.reviews);
  const visibleCountries = service.countries.slice(0, VISIBLE_CHIPS);
  const visibleLabels = service.labels.slice(0, VISIBLE_CHIPS);
  const visiblePayments = service.payment_systems.slice(0, VISIBLE_CHIPS);

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Цена", value: formatEsimPrice(service.connection_price) },
    { label: "Объем интернета", value: formatEsimVolume(service.internet_volume) },
    { label: "Срок действия", value: formatEsimValidityPeriod(service.validity_period) },
    { label: "Раздача интернета", value: formatEsimInternetSharing(service.internet_sharing) },
    { label: "Звонки", value: formatEsimCalls(service.calls) },
    { label: "Возможность пополнения", value: formatEsimTopUp(service.top_up) },
    {
      label: "Страны",
      value: (
        <div className="flex items-center gap-1.5 justify-end flex-wrap">
          {visibleCountries.map((country) => (
            <Image
              key={country.id}
              src={country.icon}
              alt={country.title}
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover"
            />
          ))}
          {service.countries.length > VISIBLE_CHIPS && (
            <span className="text-yellow-main text-sm">+{service.countries.length - VISIBLE_CHIPS}</span>
          )}
          {service.countries.length === 0 && (
            <span className="text-light-gray text-sm">—</span>
          )}
        </div>
      ),
    },
    {
      label: "Рейтинг",
      value: (
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-1 text-green-400">
            <Star className="w-4 h-4 fill-green-400 stroke-green-400" />
            <span className="font-semibold">{displayRating || "—"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <span className="text-green-400">{breakdown.positive}</span>
            <span className="text-yellow-main">{breakdown.neutral}</span>
            <span className="text-red-500">{breakdown.negative}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Метки",
      value: (
        <div className="flex items-center gap-1.5 justify-end flex-wrap">
          {visibleLabels.map((label) => (
            <Image
              key={label.id}
              src={label.icon}
              alt={label.title}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-contain bg-new-grey p-0.5"
              title={label.title}
            />
          ))}
          {service.labels.length > VISIBLE_CHIPS && (
            <span className="text-yellow-main text-sm">+{service.labels.length - VISIBLE_CHIPS}</span>
          )}
          {service.labels.length === 0 && <span className="text-light-gray text-sm">—</span>}
        </div>
      ),
    },
    {
      label: "Способы оплаты",
      value: (
        <div className="flex items-center gap-1.5 justify-end flex-wrap">
          {visiblePayments.map((system) => (
            <Image
              key={system.id}
              src={system.icon}
              alt={system.title}
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-contain bg-new-grey p-0.5"
              title={system.title}
            />
          ))}
          {service.payment_systems.length > VISIBLE_CHIPS && (
            <span className="text-yellow-main text-sm">
              +{service.payment_systems.length - VISIBLE_CHIPS}
            </span>
          )}
          {service.payment_systems.length === 0 && (
            <span className="text-light-gray text-sm">—</span>
          )}
        </div>
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
