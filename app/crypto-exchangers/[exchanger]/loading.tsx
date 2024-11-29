import { CryptoDirectionSkeleton } from "@/widgets/exchanger/crypto-direction";
import { ExchangerInfoSkeleton } from "@/widgets/exchanger/exchanger-info";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 grid gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-5/6 bg-skeleton-gray text-skeleton-gray" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
            <Skeleton className="h-5 w-full bg-skeleton-gray text-skeleton-gray" />
          </div>
        </div>
        <ExchangerInfoSkeleton />
      </div>
      <div className="flex flex-col gap-6">
        <CryptoDirectionSkeleton />
      </div>
    </section>
  );
}
