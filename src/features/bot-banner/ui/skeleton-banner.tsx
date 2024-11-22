import { ArrowRightLineIcon } from "@/shared/assets";
import { Skeleton } from "@/shared/ui";

export const SkeletonBotBanner = () => {
  return (
    <section className="text-light-gray flex mobile-xl:grid mobile-xl:grid-cols-[1.5fr,0.1fr,1fr,1fr] gap-10 items-center mobile-xl:justify-center  mobile-xl:mx-12 mobile-xl:py-7">
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 mobile-xl:h-7 w-full bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="h-5 mobile-xl:h-7  w-full bg-skeleton-gray text-skeleton-gray" />
      </div>

      <ArrowRightLineIcon
        width={60}
        height={60}
        className="self-center mobile-xl:block hidden fill-none stroke-[#b9b9b9] stroke-2 "
      />
      <div className="hidden mobile-xl:flex flex-col gap-1">
        <Skeleton className="h-5 bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="h-5 bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="h-5  bg-skeleton-gray text-skeleton-gray" />
        <Skeleton className="h-5  bg-skeleton-gray text-skeleton-gray" />
      </div>

      <Skeleton className="rounded-full h-14 w-full mobile-xl:h-[70px] mobile-xl:max-w-[275px] bg-skeleton-gray text-skeleton-gray" />
    </section>
  );
};
