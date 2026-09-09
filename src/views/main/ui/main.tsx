import { Suspense } from "react";
import { GroupPreviews } from "@/widgets/home/group-previews";
import { PreviewsSliderSkeleton } from "@/widgets/home/previews-slider";
import { SectionGroupsGrid } from "@/widgets/home/section-groups-grid";
import { TopExchangersSlider } from "@/widgets/home/top-exchangers-slider";
import { MainFAQ } from "@/widgets/main-faq";
import { MainTop } from "@/widgets/main-top";
import { SeoFooterText } from "@/widgets/strapi";
import { BotBannerNew, SkeletonBotBannerNew } from "@/features/bot-banner";
import { getSeoTexts } from "@/shared/api";
import { SECTION_GROUPS } from "@/shared/consts";
import { pageTypes, SegmentMarker } from "@/shared/types";

/**
 * Главная — витрина сервисов.
 *
 * Первые блоки не ходят в сеть, поэтому шапка и навигация по разделам уходят
 * в первый чанк HTML. Полки с данными обёрнуты каждая в свой Suspense: Next
 * стримит их по мере готовности, и медленный ответ Strapi не задерживает
 * отрисовку страницы.
 */
export const Main = async () => {
  const seoTexts = await getSeoTexts({ page: pageTypes.ratings_main });

  // «Обмен валют» показывает топ обменников из основного API — у него свой блок
  const ratingGroups = SECTION_GROUPS.filter((group) => group.key !== "currency-exchange");

  return (
    <section className="grid grid-flow-row lg:gap-[70px] md:gap-[50px] gap-[40px] min-w-0">
      <div>
        <MainTop />
        <div className="lg:-mt-8 -mt-14 mobile-xl:block hidden">
          <Suspense fallback={<SkeletonBotBannerNew />}>
            <BotBannerNew />
          </Suspense>
        </div>
      </div>

      <SectionGroupsGrid />

      <Suspense fallback={<PreviewsSliderSkeleton />}>
        <TopExchangersSlider />
      </Suspense>

      {ratingGroups.map((group) => (
        <Suspense key={group.key} fallback={<PreviewsSliderSkeleton />}>
          <GroupPreviews group={group} />
        </Suspense>
      ))}

      <Suspense>
        <SeoFooterText data={seoTexts.data} />
      </Suspense>
      <Suspense>
        <MainFAQ direction={SegmentMarker.no_cash} />
      </Suspense>
    </section>
  );
};
