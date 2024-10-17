import { PopularArrowIcon } from "@/shared/assets";
import { Skeleton } from "@/shared/ui";

export const CurrencyPairSkeleton = () => {
  return (
    <div className="px-2 py-2 grid grid-flow-col grid-rows-1 justify-between items-center rounded-[35px] shadow-[5px_5px_10px_0px_rgba(0,0,0,0.7)] bg-dark-gray hover:shadow-[5px_5px_5px_0px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-300">
      <Skeleton className="w-[45px] h-[45px] rounded-full" />

      <PopularArrowIcon width={12} />

      <Skeleton className="w-[45px] h-[45px] rounded-full" />
    </div>
  );
};
