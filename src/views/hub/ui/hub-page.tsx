import { FC, Suspense } from "react";
import { PreviewsSliderSkeleton } from "@/widgets/home/previews-slider";
import { SectionShelf } from "@/widgets/home/section-shelf";
import { HubSectionsGrid } from "@/widgets/hub/sections-grid";
import { SeoFooterText } from "@/widgets/strapi";
import { getSeoTexts } from "@/shared/api";
import { SECTION_GROUPS, SectionGroupKey, getGroupRatingSections } from "@/shared/consts";
import { pageTypes } from "@/shared/types";
import { SectionHeader } from "@/shared/ui";

interface HubPageProps {
  groupKey: SectionGroupKey;
  seoPage: pageTypes;
}

/**
 * Хаб группы: сетка её разделов и по полке предложений на каждый раздел.
 *
 * «Криптовалюты» устроены иначе (форма обмена, чёрный список) и живут своим
 * вью; здесь — общая форма для групп, целиком собранных из Strapi.
 */
export const HubPage: FC<HubPageProps> = async ({ groupKey, seoPage }) => {
  const group = SECTION_GROUPS.find((item) => item.key === groupKey)!;
  const seoTexts = await getSeoTexts({ page: seoPage });

  return (
    <section className="grid grid-flow-row lg:gap-[50px] md:gap-[40px] gap-[30px] min-w-0">
      <SectionHeader title={group.title} subtitle={group.subtitle} />

      <HubSectionsGrid group={group} />

      {getGroupRatingSections(group).map((section) => (
        <Suspense key={section.key} fallback={<PreviewsSliderSkeleton />}>
          <SectionShelf sectionKey={section.key} />
        </Suspense>
      ))}

      <Suspense>
        <SeoFooterText data={seoTexts.data} />
      </Suspense>
    </section>
  );
};
