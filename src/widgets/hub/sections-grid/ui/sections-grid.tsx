import { FC } from "react";
import { getSectionDescriptions } from "@/features/rating-preview";
import { RATING_SECTIONS, SectionGroup, getGroupSections } from "@/shared/consts";
import { SectionCard } from "./section-card";

interface HubSectionsGridProps {
  group: SectionGroup;
}

/** Раздел с коллекцией в Strapi ведёт в рейтинг, остальные — просто в раздел. */
const actionLabel = (sectionKey: string) =>
  RATING_SECTIONS.some((section) => section.key === sectionKey)
    ? "Смотреть рейтинг"
    : "Перейти в раздел";

/**
 * Сетка разделов группы: 1 карточка в ряд на мобильном, 2 на планшете,
 * 3 на широких экранах.
 *
 * Кроме навигации даёт хабу текст: без неё страница состоит из одних каруселей,
 * и индексировать на ней нечего.
 */
export const HubSectionsGrid: FC<HubSectionsGridProps> = async ({ group }) => {
  const sections = getGroupSections(group);
  const descriptions = await getSectionDescriptions(group.sectionKeys);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mobile-xl:gap-5 min-w-0">
      {sections.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          description={descriptions[section.key]}
          actionLabel={actionLabel(section.key)}
        />
      ))}
    </div>
  );
};
