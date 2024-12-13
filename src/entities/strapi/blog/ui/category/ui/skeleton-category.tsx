import { Skeleton } from "@/shared/ui";

export const CategoryCardSkeleton = () => {
  return (
    <Skeleton
      className={`text-skeleton-gray bg-skeleton-gray w-full text-center uppercase text-xs font-medium py-3 px-8 rounded-[35px] border-2 border-transparent`}
    >
      {"..........................."}
    </Skeleton>
  );
};
