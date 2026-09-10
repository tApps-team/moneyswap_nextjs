import { FC, ReactNode, Suspense } from "react";
import { getTopExchangerPreviews } from "@/features/rating-preview";
import { SECTION_BY_KEY, SECTION_GROUPS } from "@/shared/consts";
import { routes } from "@/shared/router";
import { GroupPreviewsTabs } from "../../group-previews";
import { ExchangerStats, ExchangerStatsSkeleton } from "./exchanger-stats";

interface TopExchangersSliderProps {
  /**
   * Куда ведёт ссылка в шапке. На главной — хаб «Криптовалюты», на самом хабе
   * его же ставить нельзя: ссылка вела бы на текущую страницу.
   */
  groupHref?: string;
  groupLabel?: string;
  /** Заголовок и подзаголовок: на хабе полка называется по разделу, а не по группе. */
  title?: string;
  subtitle?: string;
}

/** Полка обменников: топ приходит из основного API, а не из Strapi. */
export const TopExchangersSlider: FC<TopExchangersSliderProps> = async ({
  groupHref,
  groupLabel,
  title,
  subtitle,
}) => {
  const previews = await getTopExchangerPreviews();
  if (!previews.length) return null;

  const group = SECTION_GROUPS.find((item) => item.key === "crypto");
  const section = SECTION_BY_KEY.exchangers;

  // Направления и резервы едут вторым запросом: карточки показываются сразу,
  // а эти две строки доезжают каждая со своим скелетоном.
  const slots: Record<string, ReactNode> = Object.fromEntries(
    previews
      .filter((preview) => preview.entityId != null)
      .map((preview) => [
        preview.id,
        <Suspense key={preview.id} fallback={<ExchangerStatsSkeleton />}>
          <ExchangerStats exchangerId={preview.entityId as number} />
        </Suspense>,
      ]),
  );

  return (
    <GroupPreviewsTabs
      title={title ?? group?.title ?? "Криптовалюты"}
      subtitle={subtitle ?? group?.subtitle ?? "Проверенные обменники криптовалюты и курсы"}
      groupHref={groupHref ?? group?.href ?? routes.exchangers}
      groupLabel={groupLabel}
      tabs={[
        {
          key: section.key,
          title: section.title,
          href: routes.exchangers,
          previews,
          slots,
        },
      ]}
    />
  );
};
