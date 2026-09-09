import { PreviewsSliderSkeleton } from "@/widgets/home/previews-slider";
import { SkeletonMainTop } from "@/widgets/main-top";
import { SkeletonBotBannerNew } from "@/features/bot-banner";
import { Skeleton } from "@/shared/ui";
import "@/shared/styles/globals.scss";

export default function Loading() {
  return (
    <section className="grid grid-flow-row lg:gap-[70px] md:gap-[50px] gap-[40px]">
      <div>
        <SkeletonMainTop />
        <div className="lg:-mt-8 -mt-14 mobile-xl:block hidden">
          <SkeletonBotBannerNew />
        </div>
      </div>

      {/* Сетка направлений */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mobile-xl:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[260px] w-full rounded-[20px] bg-new-dark-grey" />
        ))}
      </div>

      <PreviewsSliderSkeleton />
      <PreviewsSliderSkeleton />
    </section>
  );
}
