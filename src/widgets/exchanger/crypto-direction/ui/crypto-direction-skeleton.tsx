import { CurrencyPairSkeleton } from "@/features/currency/currency-pair";
import { cn } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";

const mockCurrencyPair = Array.from({ length: 6 }, (_, index) => index);
export const CryptoDirectionSkeleton = () => {
  return (
    <aside className="grid grid-cols-1 grid-flow-row min-h-[36rem] max-h-[40rem] overflow-hidden  gap-4 items-start rounded-2xl  bg-dark-gray shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-5">
      <div className="grid-cols-2 gap-4 grid">
        <Skeleton className="h-12 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
        <Skeleton className="h-12 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
      </div>

      <div className="flex flex-col gap-4  p-1">
        {mockCurrencyPair.map((index) => (
          <div className="grid grid-cols-[0.7fr,1fr]   gap-6 w-full " key={index}>
            <CurrencyPairSkeleton />
            <Skeleton
              className={cn(
                `bg-[#606060] w-full min-w-12 max-w-full rounded-[15px] flex items-center justify-end px-3 ml-auto`,
              )}
            />
          </div>
        ))}
      </div>
    </aside>
  );
};
