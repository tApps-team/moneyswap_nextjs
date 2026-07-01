"use client";

import { FC, useState } from "react";
import { EsimSpecsTable } from "@/widgets/esim/esim-specs-table";
import { EsimToc } from "@/widgets/esim/esim-toc";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedReviews } from "@/widgets/ved/ved-reviews";
import { Esim, VedReview } from "@/entities/strapi";
import { cn } from "@/shared/lib";

type TabId = "overview" | "reviews";

const TABS: { value: TabId; label: string }[] = [
  { value: "overview", label: "Обзор" },
  { value: "reviews", label: "Отзывы" },
];

interface EsimServiceContentProps {
  service: Esim;
}

export const EsimServiceContent: FC<EsimServiceContentProps> = ({ service }) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const about = service.about ?? [];

  return (
    <div className="grid gap-6">
      {/* Временно скрыты табы Обзор/Отзывы (логика сохранена, дефолт — overview)
      <div className="flex gap-2 p-1.5 rounded-[12px] bg-new-dark-grey w-full lg:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 lg:flex-none whitespace-nowrap text-center px-3 mobile-xl:px-5 py-2 mobile-xl:py-2.5 rounded-[8px] text-[11px] mobile-xl:text-sm transition-colors",
              activeTab === tab.value
                ? "bg-yellow-main text-black font-medium"
                : "text-light-gray hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      */}

      {activeTab === "overview" ? (
        <div className="grid gap-6 lg:gap-8">
          <div className="grid lg:grid-cols-[1fr_minmax(220px,280px)] gap-6 lg:gap-8 items-start">
            <EsimSpecsTable service={service} />
            {about.length > 0 ? <EsimToc about={about} /> : null}
          </div>
          {about.length > 0 ? <DynamicContent dynamic_content={about} /> : null}
        </div>
      ) : (
        <VedReviews reviews={service.reviews as VedReview[]} />
      )}
    </div>
  );
};
