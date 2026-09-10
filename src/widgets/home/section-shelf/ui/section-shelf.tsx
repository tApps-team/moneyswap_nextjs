import { FC } from "react";
import { getSectionPreviews } from "@/features/rating-preview";
import { RatingSectionKey, SECTION_BY_KEY } from "@/shared/consts";
import { GroupPreviewsTabs } from "../../group-previews";

interface SectionShelfProps {
  sectionKey: RatingSectionKey;
  /** Куда ведёт ссылка в шапке; по умолчанию — сам раздел. */
  groupHref?: string;
}

/**
 * Полка одного раздела: заголовок и слайдер предложений.
 *
 * Это тот же компонент, что и у полки группы, с единственной вкладкой — ряд
 * табов при этом не рисуется, поэтому отдельная вёрстка не нужна.
 */
export const SectionShelf: FC<SectionShelfProps> = async ({ sectionKey, groupHref }) => {
  const section = SECTION_BY_KEY[sectionKey];
  const previews = await getSectionPreviews(sectionKey);

  if (!previews.length) return null;

  return (
    <GroupPreviewsTabs
      title={section.title}
      subtitle={section.description}
      groupHref={groupHref ?? section.href}
      groupLabel="Весь рейтинг"
      tabs={[
        {
          key: section.key,
          title: section.title,
          href: section.href,
          previews,
        },
      ]}
    />
  );
};
