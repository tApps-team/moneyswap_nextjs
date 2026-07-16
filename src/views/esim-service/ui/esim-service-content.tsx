"use client";

import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { EsimSpecsTable } from "@/widgets/esim/esim-specs-table";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { VedReviews } from "@/widgets/ved/ved-reviews";
import { Esim, getEsimReviewBreakdown, VedReview } from "@/entities/strapi";
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
  const breakdown = getEsimReviewBreakdown(service.reviews);
  const hasPromocodes = (service.promocodes?.length ?? 0) > 0;

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
        <div className="grid gap-[30px] md:gap-[40px] lg:gap-8 lg:grid-cols-[1fr_minmax(320px,360px)] lg:items-start">
          <div className="grid gap-[30px] md:gap-[40px] lg:gap-[50px] lg:col-start-1 lg:row-start-1">
            <EsimServiceHero service={service} breakdown={breakdown} />
            {hasPromocodes ? <EsimPromocodes service={service} /> : null}
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-[120px]">
            <EsimSpecsTable service={service} />
          </div>

          {about.length > 0 ? (
            <div className="lg:col-start-1 lg:row-start-2">
              <DynamicContent dynamic_content={about} />
            </div>
          ) : null}
        </div>
      ) : (
        <VedReviews reviews={service.reviews as VedReview[]} />
      )}
    </div>
  );
};

function EsimPromocodes({ service }: { service: Esim }) {
  return (
    <div className="grid gap-4">
      <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
        Промокоды
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service.promocodes.map((promo, index) => (
          <Link
            key={`${promo.title}-${index}`}
            href={promo.url || service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-new-dark-grey border border-[#575A62]/50 rounded-[15px] p-5 hover:border-yellow-main transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-yellow-main/15 text-yellow-main">
              <Gift className="w-5 h-5" />
            </div>
            <div className="grid gap-1 min-w-0">
              <span className="font-semibold text-white text-sm mobile-xl:text-base">
                {promo.title}
              </span>
              <span className="text-xs mobile-xl:text-sm text-light-gray">{promo.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EsimServiceHero({
  service,
  breakdown,
}: {
  service: Esim;
  breakdown: { positive: number; neutral: number; negative: number };
}) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {service.logo ? (
            <Image
              src={service.logo}
              alt={service.name}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {service.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              Виртуальные сим-карты {service.name}
            </h1>
            {/* Временно скрыт блок отзывов 0 0 0 (логика сохранена)
            <div className="flex items-center gap-1.5 text-xs mobile-xl:text-sm font-medium">
              <span className="text-yellow-main">{breakdown.positive}</span>
              <span className="text-light-gray">{breakdown.neutral}</span>
              <span className="text-[#D20000]">{breakdown.negative}</span>
            </div>
            */}
          </div>
        </div>

        <Link
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-fit px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Перейти на сайт
        </Link>
      </div>
    </div>
  );
}
