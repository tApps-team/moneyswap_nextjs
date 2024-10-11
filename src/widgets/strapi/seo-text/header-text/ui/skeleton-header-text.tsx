import { Skeleton } from "@/shared/ui";

export const SkeletonSeoHeaderText = () => {
  return (
    <>
      <div className="grid gap-[20px]">
        <div className="relative">
          <div className="text-[28px] strapi_styles max-w-[90%]" />
          <Skeleton className="h-[38px] w-3/4" />

          <div className="absolute top-0 right-0 grid grid-flow-col gap-4 justify-center items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="w-9 h-9 rounded-full" />
              <Skeleton className="w-9 h-9 rounded-full" />
            </div>
          </div>
        </div>
        <div className="strapi_styles text-sm flex flex-col gap-1 max-h-[68px]">
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
    </>
  );
};
