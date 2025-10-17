import { SkeletonCurrencySelectForm } from "@/widgets/currency-select-form";
import { SkeletonSeoHeaderText } from "@/widgets/strapi";
import { SkeletonBotBannerNew } from "@/features/bot-banner";
import { Skeleton } from "@/shared/ui";
import "@/shared/styles/globals.scss";

export default function Loading() {
  return (
    <section className="">
      <SkeletonSeoHeaderText />
      <div className="lg:-mt-8 mobile-xl:block hidden lg:mb-[65px] mobile-xl:mb-10">
        <SkeletonBotBannerNew isExchange />
      </div>
      <div className="grid grid-flow-row gap-10">
        <SkeletonCurrencySelectForm />
        <Skeleton className="rounded-3xl w-full h-[56rem]  bg-new-grey" />
      </div>
    </section>
  );
}
