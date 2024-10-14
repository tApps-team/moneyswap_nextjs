import { ArrowRightLineIcon } from "@/shared/assets";
import { Skeleton } from "@/shared/ui";

export const SkeletonBotBanner = () => {
  return (
    <section className="text-light-gray grid grid-cols-[1.5fr,0.1fr,1fr,1fr] gap-10 items-center justify-center mx-12 py-7">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7" />
        <Skeleton className="h-7" />
      </div>

      <ArrowRightLineIcon
        width={60}
        height={60}
        className="self-center fill-none stroke-[#b9b9b9] stroke-2 "
      />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>

      <Skeleton className="rounded-full h-[70px] max-w-[275px]" />
    </section>
  );
};
