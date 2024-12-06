import { Skeleton } from "@/shared/ui";

export const ArticlePreviewCardSkeleton = () => {
  return (
    <div className={`group xl:rounded-[30px] rounded-[24px] h-full w-full`}>
      <div className="w-full max-w-full lg:h-[calc(100vw_/_7.91)] md:h-[calc(100vw_/_4.25)] mobile-xl:h-[calc(100vw_/_3.04)] h-[calc(100vw_/_2.3741)] lg:max-h-[189px] rounded-[30px] overflow-hidden">
        <Skeleton className="bg-skeleton-gray text-skeleton-gray w-full h-full object-cover">
          image
        </Skeleton>
      </div>
      <div className={`uppercase grid grid-flow-row gap-1 py-4`}>
        <Skeleton className="bg-skeleton-gray text-skeleton-gray font-medium text-3xs w-[30%]">
          ....
        </Skeleton>
        <Skeleton className="bg-skeleton-gray text-skeleton-gray text-2xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
          ...
        </Skeleton>
        <Skeleton className="bg-skeleton-gray text-skeleton-gray text-2xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2 w-[65%]">
          ...
        </Skeleton>
      </div>
    </div>
  );
};
