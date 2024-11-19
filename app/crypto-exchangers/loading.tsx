import { SkeletonSeoHeaderText } from "@/widgets/strapi";
import { SkeletonBotBanner } from "@/features/bot-banner";
import { SwitcherIcon } from "@/shared/assets";
import "@/shared/styles/globals.scss";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3">
        <div>
          <SkeletonSeoHeaderText />
        </div>
        <Skeleton className="w-full h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-11/12 h-4 rounded-full bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-11/12 h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-11/12 h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-11/12 h-4 rounded-full bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-11/12 h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-full h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-full h-4 rounded-full bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="w-full h-4 rounded-full  bg-skeleton-gray text-skeleton-gray" />
      </div>
      <SkeletonBotBanner />
      <div className="text-white w-full border-2 border-light-gray h-full py-5 px-7 pb-12 bg-dark-gray rounded-3xl">
        <div className="flex mobile-xl:flex-row  flex-col justify-between mobile-xl:items-center items-start mobile-xl:gap-0 gap-4 uppercase">
          <Skeleton className="h-6 mobile-xl:w-80 w-full bg-skeleton-gray text-skeleton-gray" />

          <div className="flex w-1/2 mobile-xl:w-1/5 items-center justify-between gap-2 pb-6">
            <Skeleton className="h-6 w-2/3 mobile-xl:w-36 bg-skeleton-gray text-skeleton-gray" />
            <span>/</span>
            <Skeleton className="h-6 w-2/3 mobile-xl:w-36 bg-skeleton-gray text-skeleton-gray" />
          </div>
        </div>
        <div className="mobile-xl:grid mobile-xl:grid-cols-[1fr,auto,1fr] mobile-xl:grid-rows-1 flex flex-col mobile-xl:items-end items-center mobile-xl:justify-between gap-4 ">
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-6 w-1/3 bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-16 w-full rounded-full bg-skeleton-gray text-skeleton-gray" />
          </div>
          <SwitcherIcon className="mobile-xl:mb-[20px] mobile-xl:mx-6 " width={30} fill="#f6ff5f" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-6 w-1/3 bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-16 w-full rounded-full bg-skeleton-gray text-skeleton-gray" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="rounded-3xl w-full h-[56rem]  bg-skeleton-gray  text-skeleton-gray" />
      </div>
    </section>
  );
}
