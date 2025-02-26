import { Skeleton } from "@/shared/ui";

export const SkeletonMainTop = () => {
  return (
    <section className="lg:pt-10 mobile-xl:pt-6 pt-0 lg:pb-[120px] mobile-xl:pb-[80px] pb-0 mobile-xl:mb-0 mb-5 lg:bg-[url(/redesign/main_currencies.png)] bg-transparent bg-contain bg-no-repeat bg-center">
      <div className="grid mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start gap-12">
        <Skeleton className="h-5 bg-skeleton-gray text-skeleton-gray lg:block hidden text-base font-light w-[24vw]" />
        <h1 className="grid lg:gap-6 md:gap-4 mobile-xl:gap-3 gap-1.5 uppercase mobile-xl:justify-center justify-start mobile-xl:justify-items-center justify-items-start">
          <Skeleton className="lg:w-[28vw] md:w-[36vw] mobile-xl:w-[44vw] w-[40vw] lg:h-12 md:h-7 mobile-xl:h-6 h-4 bg-skeleton-gray text-skeleton-gray unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base font-bold" />
          <Skeleton className="lg:w-[32vw] md:w-[40vw] mobile-xl:w-[48vw] w-[54vw] lg:h-12 md:h-7 mobile-xl:h-6 h-4 bg-skeleton-gray text-skeleton-gray unbounded_font md:leading-normal leading-tight lg:text-[44px] md:text-[30px] mobile-xl:text-2xl text-base font-bold" />
          <Skeleton className="lg:w-[24vw] md:w-[32vw] mobile-xl:w-[40vw] w-[34vw] lg:h-12 md:h-7 mobile-xl:h-6 h-4 bg-skeleton-gray text-skeleton-gray unbounded_font md:leading-normal leading-tight lg:text-[36px] md:text-2xl mobile-xl:text-xl text-sm font-medium lg:mt-2 md:mt-4 mobile-xl:mt-0 mt-1" />
        </h1>
        <div className="lg:grid hidden grid-flow-row gap-3 justify-center justify-items-center">
          <Skeleton className="h-4 bg-skeleton-gray text-skeleton-gray text-base font-light w-[50vw] max-w-[980px] text-center" />
          <Skeleton className="h-4 bg-skeleton-gray text-skeleton-gray text-base font-light w-[32vw] text-center" />
        </div>
      </div>
    </section>
  );
};
