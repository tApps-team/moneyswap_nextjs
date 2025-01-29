import { Skeleton } from "@/shared/ui";

export const SkeletonSeoHeaderText = async () => {
  return (
    <>
      <div className="grid gap-2 mobile-xl:gap-5">
        <div className="relative">
          <Skeleton className="mobile-xl:h-[38px] w-3/5 h-4 mobile-xl:w-3/4 bg-skeleton-gray text-skeleton-gray" />

          <div className="absolute block top-0 right-0 mobile-xl:grid grid-flow-col gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full bg-skeleton-gray text-skeleton-gray" />
              <Skeleton className="size-8 rounded-full bg-skeleton-gray text-skeleton-gray" />
            </div>
          </div>
        </div>
        <div className="strapi_styles text-sm flex flex-col gap-1 max-h-[68px]">
          <Skeleton className="hidden mobile-xl:block mobile-xl:h-5 mobile-xl:w-11/12 bg-skeleton-gray text-skeleton-gray" />
          <Skeleton className="mobile-xl:h-5 h-4 w-2/5 bg-skeleton-gray text-skeleton-gray" />
        </div>
      </div>
    </>
  );
};
