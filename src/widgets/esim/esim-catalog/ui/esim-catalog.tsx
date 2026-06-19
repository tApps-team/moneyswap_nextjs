import Link from "next/link";
import { FC } from "react";
import { EsimList } from "@/widgets/esim/esim-list";
import { Pagination } from "@/features/pagination";
import { Esim, EsimMarketType } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";

interface EsimCatalogProps {
  services: Esim[];
  marketType: EsimMarketType;
  page: number;
  totalPages: number;
}

const TABS: { value: EsimMarketType; label: string }[] = [
  { value: "international", label: "Международные" },
  { value: "russian", label: "Российские" },
];

export const EsimCatalog: FC<EsimCatalogProps> = ({ services, marketType, page, totalPages }) => {
  return (
    <div className="grid gap-6">
      <div className="flex gap-2 p-1.5 rounded-[12px] bg-new-dark-grey w-full lg:w-fit">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`${routes.esim}?market=${tab.value}&page=1`}
            scroll={false}
            className={cn(
              "flex-1 lg:flex-none whitespace-nowrap text-center px-3 mobile-xl:px-5 py-2 mobile-xl:py-2.5 rounded-[8px] text-[11px] mobile-xl:text-sm transition-colors",
              marketType === tab.value
                ? "bg-yellow-main text-black font-medium"
                : "text-light-gray hover:text-white",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <EsimList services={services} />

      {totalPages > 1 ? (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} route={routes.esim} />
        </div>
      ) : null}
    </div>
  );
};
