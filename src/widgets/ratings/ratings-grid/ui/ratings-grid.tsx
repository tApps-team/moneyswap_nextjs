import { FC } from "react";
import { RatingSection } from "@/shared/consts";
import { RatingSectionCard } from "./rating-section-card";

export interface RatingsGridItem {
  section: RatingSection;
  description: string | null;
}

interface RatingsGridProps {
  items: RatingsGridItem[];
}

/** Сетка разделов: 1 карточка в ряд на мобильном, 2 на планшете, 3 на широких экранах. */
export const RatingsGrid: FC<RatingsGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mobile-xl:gap-5 min-w-0">
      {items.map(({ section, description }) => (
        <RatingSectionCard key={section.key} section={section} description={description} />
      ))}
    </div>
  );
};
