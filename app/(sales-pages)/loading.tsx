import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { SkeletonMainTop } from "@/widgets/main-top";
import { SkeletonBotBannerNew } from "@/features/bot-banner";
import { Skeleton } from "@/shared/ui";
import "@/shared/styles/globals.scss";

export default function Loading() {
  return (
    <section className="">
      <SkeletonMainTop />
      <div className="lg:-mt-8 -mt-14 mobile-xl:block hidden lg:mb-[65px] mobile-xl:mb-10">
        <SkeletonBotBannerNew />
      </div>
      <div className="grid grid-flow-row gap-10">
        <SkeletonCurrencySelectForm />
        <Skeleton className="rounded-3xl w-full h-[56rem]  bg-new-grey" />
      </div>
    </section>
  );
}
