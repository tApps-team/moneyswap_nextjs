"use client";

import { FC, useMemo, useState } from "react";
import {
  VedReview,
  VedReviewCard,
  VedReviewFilter,
  filterVedReviews,
  getVedAgentReviewsDisplay,
} from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

const FILTER_OPTIONS: { value: VedReviewFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "positive", label: "Положительные" },
  { value: "negative", label: "Отрицательные" },
  { value: "neutral", label: "Нейтральные" },
];

interface VedReviewsProps {
  reviews: VedReview[];
}

export const VedReviews: FC<VedReviewsProps> = ({ reviews }) => {
  const [filter, setFilter] = useState<VedReviewFilter>("all");

  const allReviews = useMemo(() => getVedAgentReviewsDisplay(reviews), [reviews]);
  const filteredReviews = useMemo(
    () => filterVedReviews(allReviews, filter),
    [allReviews, filter],
  );

  const totalCount = allReviews.length;

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
            Отзывы
          </h2>
          <span className="text-xs mobile-xl:text-sm text-light-gray">Всего {totalCount}</span>
        </div>

        <Button
          asChild
          className="w-fit bg-yellow-main hover:bg-yellow-main/90 text-black rounded-[10px] px-5 py-2.5 h-auto text-sm uppercase"
        >
           Оставить отзыв
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-colors",
              filter === option.value
                ? "border-yellow-main text-yellow-main bg-yellow-main/10"
                : "border-[#575A62] text-light-gray hover:border-yellow-main/50 hover:text-white",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mobile-xl:gap-6">
          {filteredReviews.map((review) => (
            <VedReviewCard
              key={review.id}
              review={review}
              onReply={() => {}}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-light-gray py-10 bg-new-dark-grey rounded-[15px]">
          Нет отзывов в этой категории
        </p>
      )}
    </section>
  );
};
