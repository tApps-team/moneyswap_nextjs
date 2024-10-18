import { Skeleton } from "@/shared/ui";

export const ExchangerInfoSkeleton = () => {
  return (
    <section className="rounded-2xl w-full grid gap-4 max-h-[856px]   bg-gradient-to-r from-light-gray from-0% to-20% to-dark-gray p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
      <h2 className="text-xl font-medium ">
        <Skeleton className="h-7 w-2/3 bg-[#9d9d9d] text-[#9d9d9d]" />
      </h2>
      <hr className="mx-[-1.5rem]" />
      <div className="grid grid-cols-[0.3fr,1fr]  gap-4 ">
        <div className="rounded-full   flex items-center   justify-center h-full w-full  ">
          <Skeleton className="w-56 h-56 rounded-full bg-[#9d9d9d] text-[#9d9d9d]" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-1/2 rounded-2xl w-full bg-[#9d9d9d] text-[#9d9d9d]" />
          <Skeleton className="h-1/2 rounded-2xl w-full bg-[#9d9d9d] text-[#9d9d9d]" />
        </div>
      </div>
    </section>
  );
};
