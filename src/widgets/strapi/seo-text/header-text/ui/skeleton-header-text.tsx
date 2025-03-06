import { Skeleton } from "@/shared/ui";

export const SkeletonSeoHeaderText = async () => {
  return (
    <section className="grid lg:grid-cols-[1fr_1fr] grid-cols-1 justify-between lg:mb-[60px] mobile-xl:mb-6 mb-5">
      <div className="grid grid-flow-row mobile-xl:gap-6 gap-3">
        <div className="lg:hidden grid grid-cols-2 mobile-xl:gap-5 gap-2.5 w-fit uppercase">
          <Skeleton className="lg:w-[248px] lg:h-[48px] mobile-xl:w-[196px] mobile-xl:h-[40px] mobile:w-[154px] w-[140px] h-[27px]  bg-new-grey" />
          <Skeleton className="lg:w-[248px] lg:h-[48px] mobile-xl:w-[196px] mobile-xl:h-[40px] mobile:w-[154px] w-[140px] h-[27px]  bg-new-grey" />
        </div>
        <h1 className="text-yellow-main uppercase flex flex-col lg:gap-3 gap-2">
          <Skeleton className="w-[15vw] lg:h-[34px] md:h-[32px] mobile-xl:h-[28px] mobile:h-[20px] h-[16px] bg-skeleton-gray text-skeleton-gray" />
          <Skeleton className="xl:text-2xl lg:text-xl md:text-2xl mobile-xl:text-xl mobile:text-base mobile-xs:text-sm text-xs font-medium bg-skeleton-gray text-skeleton-gray w-[80%] mobile-xl:h-[28px] mobile:h-[20px] h-[16px]" />
          <Skeleton className="mobile-xl:hidden block xl:text-2xl lg:text-xl md:text-2xl mobile-xl:text-xl mobile:text-base mobile-xs:text-sm text-xs font-medium bg-skeleton-gray text-skeleton-gray md:h-[32px] mobile-xl:h-[28px] mobile:h-[20px] h-[16px] w-[30%]" />
        </h1>
        <div className="lg:grid grid-flow-row gap-2 hidden max-w-[90%]">
          <Skeleton className="bg-skeleton-gray text-skeleton-gray w-[90%] h-4" />
          <Skeleton className="bg-skeleton-gray text-skeleton-gray w-[60%] h-4" />
          <Skeleton className="bg-skeleton-gray text-skeleton-gray w-[80%] h-4" />
        </div>
      </div>
    </section>
  );
};
