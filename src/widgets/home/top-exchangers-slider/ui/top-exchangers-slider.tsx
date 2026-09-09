import { ReactNode, Suspense } from "react";
import { getTopExchangerPreviews } from "@/features/rating-preview";
import { SECTION_GROUPS } from "@/shared/consts";
import { routes } from "@/shared/router";
import { GroupPreviewsTabs } from "../../group-previews";
import { ExchangerStats, ExchangerStatsSkeleton } from "./exchanger-stats";

/** Полка «Обмен валют»: топ обменников приходит из основного API, а не из Strapi. */
export const TopExchangersSlider = async () => {
  const previews = await getTopExchangerPreviews();
  if (!previews.length) return null;

  const group = SECTION_GROUPS.find((item) => item.key === "currency-exchange");

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
      title={group?.title ?? "Обмен валют"}
      subtitle={group?.subtitle ?? "Проверенные обменники криптовалюты и актуальные курсы"}
      groupHref={group?.href ?? routes.exchangers}
      tabs={[
        {
          key: "exchangers",
          title: "Обменники",
          href: routes.exchangers,
          previews,
          slots,
        },
      ]}
    />
  );
};
