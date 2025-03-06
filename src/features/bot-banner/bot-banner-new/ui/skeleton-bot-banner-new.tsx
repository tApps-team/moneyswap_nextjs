import { Skeleton } from "@/shared/ui";

export const SkeletonBotBannerNew = ({ isExchange }: { isExchange?: true }) => {
  return (
    <Skeleton
      className={`${isExchange ? "" : "mx-auto"} bg-skeleton-gray lg:h-[68px] md:h-[64px] h-[60px] w-[260px]`}
    />
  );
};
