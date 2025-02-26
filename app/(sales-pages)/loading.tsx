import { SkeletonSeoHeaderText } from "@/widgets/strapi";
import { SkeletonBotBanner } from "@/features/bot-banner";
import { LoaderAnimation, SwitcherIcon } from "@/shared/assets";
import "@/shared/styles/globals.scss";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    // <section className="grid gap-6">
    //   <SkeletonSeoHeaderText />
    //   <SkeletonBotBanner />
    //   <div className="text-white w-full border-2 border-light-gray h-full md:py-5 py-3 md:px-7 px-5 md:pb-12 pb-4 bg-dark-gray rounded-3xl">
    //     <div className="flex md:flex-row  flex-col justify-between md:items-center items-start md:gap-0 gap-4 uppercase">
    //       <Skeleton className="md:h-6 h-5 md:w-80 w-[90%] bg-skeleton-gray text-skeleton-gray" />

    //       <div className="flex w-2/3 md:w-1/5 items-center justify-between gap-2 pb-6">
    //         <Skeleton className="md:h-5 h-4 w-full md:w-36 bg-skeleton-gray text-skeleton-gray" />
    //         <span>/</span>
    //         <Skeleton className="md:h-5 h-4 w-full md:w-36 bg-skeleton-gray text-skeleton-gray" />
    //       </div>
    //     </div>
    //     <div className="lg:grid lg:grid-cols-[1fr,auto,1fr] lg:grid-rows-1 flex flex-col lg:items-end items-center lg:justify-between gap-4 ">
    //       <div className="flex w-full flex-col gap-2">
    //         <Skeleton className="lg:h-6 h-5 w-1/3 bg-skeleton-gray text-skeleton-gray" />
    //         <Skeleton className="lg:h-16 h-14 w-full rounded-full bg-skeleton-gray text-skeleton-gray" />
    //       </div>
    //       <SwitcherIcon className="lg:mb-[20px] lg:mx-6 " width={30} fill="#f6ff5f" />
    //       <div className="flex w-full flex-col gap-2">
    //         <Skeleton className="lg:h-6 h-5 w-1/3 bg-skeleton-gray text-skeleton-gray" />
    //         <Skeleton className="lg:h-16 h-14 w-full rounded-full bg-skeleton-gray text-skeleton-gray" />
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <Skeleton className="rounded-3xl w-full h-[56rem]  bg-skeleton-gray  text-skeleton-gray" />
    //   </div>
    // </section>
    <div className="min-h-[90dvh]">
      <LoaderAnimation />
    </div>
  );
}
