import { Suspense } from "react";
import { GroupPreviews } from "@/widgets/home/group-previews";
import { PreviewsSliderSkeleton } from "@/widgets/home/previews-slider";
import { SectionGroupsGrid } from "@/widgets/home/section-groups-grid";
import { SectionShelf } from "@/widgets/home/section-shelf";
import { TopExchangersSlider } from "@/widgets/home/top-exchangers-slider";
import { MainFAQ } from "@/widgets/main-faq";
import { MainTop } from "@/widgets/main-top";
import { SeoFooterText } from "@/widgets/strapi";
import { BotBannerNew, SkeletonBotBannerNew } from "@/features/bot-banner";
import { faqTypes } from "@/entities/strapi";
import { getSeoTexts } from "@/shared/api";
import { HOME_SHELVES } from "@/shared/consts";
import { pageTypes } from "@/shared/types";

/**
 * Главная — витрина сервисов.
 *
 * Первые блоки не ходят в сеть, поэтому шапка и навигация по разделам уходят
 * в первый чанк HTML. Каждая полка обёрнута в свой Suspense: Next стримит их
 * по мере готовности, и медленный ответ Strapi не задерживает отрисовку.
 *
 * Ключ ratings_main достался от прежнего хаба /ratings — за ним живой контент
 * в Strapi, поэтому переименовывать его не стали.
 */
export const Main = async () => {
  const seoTexts = await getSeoTexts({ page: pageTypes.ratings_main });

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

      {HOME_SHELVES.map((entry) => (
        <Suspense key={entry.key} fallback={<PreviewsSliderSkeleton />}>
          {entry.kind === "group" ? (
            // У «Криптовалют» карточки приходят из основного API, а не из Strapi
            entry.key === "crypto" ? (
              <TopExchangersSlider />
            ) : (
              <GroupPreviews group={entry.group} />
            )
          ) : (
            <SectionShelf sectionKey={entry.key} />
          )}
        </Suspense>
      ))}

      <Suspense>
        <SeoFooterText data={seoTexts.data} />
      </Suspense>
      <Suspense>
        <MainFAQ primary={{ type: faqTypes.from_users, title: "Вопросы от пользователей" }} />
      </Suspense>
    </section>
  );
};
