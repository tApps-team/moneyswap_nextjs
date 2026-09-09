import { FC } from "react";
import { getSectionPreviews } from "@/features/rating-preview";
import { SectionGroup, getGroupRatingSections } from "@/shared/consts";
import { GroupPreviewTab, GroupPreviewsTabs } from "./group-previews-tabs";

interface GroupPreviewsProps {
  group: SectionGroup;
}

/** Грузит подборки всех разделов группы и отдаёт их клиентским табам. */
export const GroupPreviews: FC<GroupPreviewsProps> = async ({ group }) => {
  const sections = getGroupRatingSections(group);

  const tabs: GroupPreviewTab[] = await Promise.all(
    sections.map(async (section) => ({
      key: section.key,
      title: section.title,
      href: section.href,
      previews: await getSectionPreviews(section.key),
    })),
  );

  // Если Strapi не отдал ни одного предложения — блок не показываем,
  // пустая карусель выглядела бы поломкой
  const filled = tabs.filter((tab) => tab.previews.length > 0);
  if (!filled.length) return null;

  return (
    <GroupPreviewsTabs
      title={group.title}
      subtitle={group.subtitle}
      groupHref={group.href}
      tabs={filled}
    />
  );
};
