import { SkeletonSeoHeaderText } from "@/widgets/strapi";
import { SkeletonBotBanner } from "@/features/bot-banner";
import { SwitcherIcon } from "@/shared/assets";
import "@/shared/styles/globals.scss";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid gap-6">
      <SkeletonSeoHeaderText />
      <SkeletonBotBanner />
      <div className="text-white w-full border-2 border-light-gray h-full py-5 px-7 pb-12 bg-dark-gray rounded-3xl">
        <div className="flex justify-between items-center uppercase">
          <Skeleton className="h-6 w-80" />
          <div className="flex items-center justify-between gap-2 pb-6">
            <Skeleton className="h-6 w-36" />
            <span>/</span>
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] grid-rows-1 items-end justify-between gap-4 ">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-16 rounded-full" />
          </div>
          <SwitcherIcon className="mb-[20px] mx-6 " width={30} fill="#f6ff5f" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-16 rounded-full" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="rounded-3xl w-full h-[56rem]" />
      </div>
    </section>
  );
}
