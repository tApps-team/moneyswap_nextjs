import { Skeleton } from "@/shared/ui";

export const ExchangerInfoSkeleton = () => {
  return (
    <section className="rounded-2xl w-full grid gap-4 max-h-[856px]   md:bg-gradient-to-r md:from-light-gray md:from-0% md:to-20% md:to-dark-gray p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
      <h2 className="text-xl font-medium ">
        <Skeleton className="h-7 md:w-2/3 w-full bg-skeleton-gray text-skeleton-gray" />
      </h2>
      <hr className="mx-[-1.5rem]" />
      <div className="md:grid md:grid-cols-[0.3fr,1fr] flex flex-col   gap-4 ">
        <div className="rounded-full   flex items-center   justify-center h-full w-full  ">
          <Skeleton className="md:size-56 size-32 rounded-full bg-skeleton-gray text-skeleton-gray" />
        </div>
        <div className="md:grid-cols-4 md:grid-rows-2 grid grid-cols-2 grid-rows-4 w-full gap-4">
          <Skeleton className="md:h-28 h-[72px] rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28 h-[72px] rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28 h-[72px]  rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28 h-[72px]  rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28  h-[72px]  rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28 h-[72px]  rounded-2xl w-full bg-skeleton-gray " />
          <Skeleton className="md:h-28 col-span-2 h-[72px]  rounded-2xl w-full bg-skeleton-gray " />
        </div>
      </div>
    </section>
  );
};
