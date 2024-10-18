import { CryptoDirectionSkeleton } from "@/widgets/exchanger/crypto-direction";
import { ExchangerInfoSkeleton } from "@/widgets/exchanger/exchanger-info";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid grid-cols-3 gap-8">
      <div className="col-span-2 grid gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-5/6 bg-[#9d9d9d] text-[#9d9d9d]" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
            <Skeleton className="h-5 w-full bg-[#9d9d9d] text-[#9d9d9d]" />
          </div>
        </div>
        <ExchangerInfoSkeleton />
        {/* <ExchangerInfo exchangerDetails={exchangerDetails} />
    <ExchangerReviews
      reviewCount={exchangerDetails.reviews}
      totalPages={reviews.pages}
      reviews={reviews.content}
    />  */}
      </div>
      <div className="flex flex-col gap-6">
        <CryptoDirectionSkeleton />
        {/* 
    <BotBannerSidebar /> */}
      </div>
    </section>
  );
}
