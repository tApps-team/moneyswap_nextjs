import { cn } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";

export const SkeletonCurrencySelectForm = () => {
  return (
    <section>
      <form
        className={cn(
          "grid grid-flow-row text-white w-full border-light-gray h-full lg:pb-10 lg:py-6 lg:px-7 md:p-8 md:py-3 md:px-5 md:pb-4 p-4 mobile-xl:pb-[30px] pb-5 bg-new-dark-grey rounded-[15px] md:gap-5 gap-0",
        )}
      >
        <div className="flex md:flex-row flex-col lg:gap-2 gap-4 md:items-center justify-between">
          <p className={cn("uppercase hidden md:block lg:text-xl md:text-lg font-semibold")}>
            Выберите направление обмена
          </p>
          <div className="flex flex-col mobile-xs:flex-row justify-center md:justify-between mobile-xs:gap-0 items-start mobile-xs:items-center">
            <div className="grid grid-cols-2 gap-2 items-center w-full md:gap-2">
              <Skeleton
                className={cn(
                  "p-0 mobile-xl:text-base text-sm text-center h-full mobile-xl:px-7 px-2 py-4 font-semibold rounded-[10px] bg-skeleton-gray  text-skeleton-gray",
                )}
              >
                Безналичные
              </Skeleton>

              <Skeleton
                className={cn(
                  " p-0 mobile-xl:text-base text-sm text-center h-full mobile-xl:px-7 px-2 py-4 font-semibold rounded-[10px] bg-skeleton-gray  text-skeleton-gray",
                )}
              >
                Наличные
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-1 items-center justify-between lg:grid-cols-[1fr,auto,1fr]  lg:items-center lg:justify-center w-full gap-4">
          <Skeleton className="lg:h-[233px] md:h-[101px] mobile-xl:h-[95px] mobile:h-[92px] h-[86px] bg-skeleton-gray  text-skeleton-gray rounded-[15px]" />
          <Skeleton className="md:size-[54px] size-[40px] bg-skeleton-gray  text-skeleton-gray rounded-full mx-auto" />
          <Skeleton className="lg:h-[233px] md:h-[101px] mobile-xl:h-[95px] mobile:h-[92px] h-[86px] bg-skeleton-gray  text-skeleton-gray rounded-[15px]" />
        </div>
        <Skeleton className="md:hidden px-4 py-3 grid grid-cols-2 items-center justify-stretch justify-items-stretch w-full gap-2 bg-new-grey  text-new-grey rounded-[10px]">
          <div className="grid grid-flow-row gap-2">
            <Skeleton className="mobile-xl:h-6 h-5 w-[24vw] bg-new-light-grey  text-new-light-grey rounded-[5px]" />
            <Skeleton className="mobile-xl:h-9 h-8 w-full bg-new-light-grey  text-new-light-grey rounded-[10px]" />
          </div>
          <div className="grid grid-flow-row gap-2">
            <Skeleton className="mobile-xl:h-6 h-5 w-[24vw] bg-new-light-grey  text-new-light-grey rounded-[5px]" />
            <Skeleton className="mobile-xl:h-9 h-8 w-full bg-new-light-grey  text-new-light-grey rounded-[10px]" />
          </div>
          {/* <Skeleton className="mobile-xl:h-[95px] mobile:h-[92px] h-[86px] bg-new-grey  text-new-grey rounded-[15px]" /> */}
        </Skeleton>
      </form>
      <Skeleton className="md:hidden flex items-center justify-center rounded-[6px] mx-auto bg-new-light-grey -translate-y-3 w-1/4 h-6" />
    </section>
  );
};
