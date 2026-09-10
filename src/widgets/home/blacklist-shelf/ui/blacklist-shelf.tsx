import { getBlacklistPreviews } from "@/features/rating-preview";
import { SECTION_BY_KEY } from "@/shared/consts";
import { routes } from "@/shared/router";
import { GroupPreviewsTabs } from "../../group-previews";

/** Полка чёрного списка: обменники, к которым стоит относиться с осторожностью. */
export const BlacklistShelf = async () => {
  const previews = await getBlacklistPreviews();
  if (!previews.length) return null;

  const section = SECTION_BY_KEY.blacklist;

  return (
    <GroupPreviewsTabs
      title={section.title}
      subtitle={section.description}
      groupHref={routes.blacklist}
      groupLabel="Весь список"
      allLabel="Смотреть весь список"
      tabs={[
        {
          key: section.key,
          title: section.title,
          href: routes.blacklist,
          previews,
        },
      ]}
    />
  );
};
