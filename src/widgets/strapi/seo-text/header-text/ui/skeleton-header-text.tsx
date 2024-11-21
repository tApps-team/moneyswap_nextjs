import { Skeleton } from "@/shared/ui";

export const SkeletonSeoHeaderText = () => {
  return (
    <>
      <div className="grid gap-2  mobile-xl:gap-5">
        <div className="relative">
          <div className="text-[28px] strapi_styles max-w-[90%]" />
          <Skeleton className="mobile-xl:h-[38px] w-1/2 h-5 mobile-xl:w-3/4 bg-skeleton-gray text-skeleton-gray" />

          <div className="absolute block top-0 right-0 mobile-xl:grid grid-flow-col gap-4 justify-center items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-full bg-skeleton-gray text-skeleton-gray" />
              <Skeleton className="size-9 rounded-full bg-skeleton-gray text-skeleton-gray" />
            </div>
          </div>
        </div>
        <div className="strapi_styles text-sm flex flex-col gap-1 max-h-[68px]">
          <Skeleton className="mobile-xl:h-5 h-5 w-2/3 mobile-xl:w-11/12 bg-skeleton-gray text-skeleton-gray" />
          <Skeleton className="mobile-xl:h-5 h-5 w-2/3 bg-skeleton-gray text-skeleton-gray" />
          {/* <Skeleton className="mobile-xl:h-5 h-3 w-1/3 bg-skeleton-gray text-skeleton-gray" /> */}
        </div>
      </div>
    </>
  );
};
