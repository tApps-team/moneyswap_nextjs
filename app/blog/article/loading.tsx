import { BlogSidebarSkeleton } from "@/widgets/strapi";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid grid-flow-cols gap-6">
      <Skeleton className="bg-[#9d9d9d] text-[#9d9d9d] grid grid-cols-[repeat(5,_auto)] gap-2 justify-start justify-items-start items-center uppercase font-semibold text-sm w-[70%]">
        ...
      </Skeleton>
      <div className="grid grid-flow-rows gap-6">
        <Skeleton className="bg-[#9d9d9d] text-[#9d9d9d] text-3xl font-medium uppercase w-[90%]">
          ...
        </Skeleton>
        <Skeleton className="bg-[#9d9d9d] text-[#9d9d9d] text-3xl font-medium uppercase w-[30%]">
          ...
        </Skeleton>
        <Skeleton className="bg-[#9d9d9d] text-[#9d9d9d] font-medium text-sm uppercase tracking-widest w-[10%]">
          ...
        </Skeleton>
      </div>
      <section className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <div className="grid grid-flow-rows gap-8">
          <div className="grid grid-flow-row gap-8 bg-[#2d2d2d] p-10 pb-8 rounded-[35px] shadow-[2px_2px_10px_3px_rgba(0,0,0,0.35)]">
            <div className="w-full h-[30vw] max-h-[800px] rounded-[35px] overflow-hidden">
              <Skeleton className="bg-[#9d9d9d] text-[#9d9d9d] w-full h-full object-cover">
                ...
              </Skeleton>
            </div>
            <div className="grid gap-2">
              <Skeleton className="text-sm uppercase bg-[#9d9d9d] text-[#9d9d9d] w-[80%]">
                ...
              </Skeleton>
              <Skeleton className="text-sm uppercase bg-[#9d9d9d] text-[#9d9d9d]">...</Skeleton>
              <Skeleton className="text-sm uppercase bg-[#9d9d9d] text-[#9d9d9d] w-[30%]">
                ...
              </Skeleton>
            </div>
          </div>
          <div className="grid gap-10">
            <Skeleton className="h-[200px] bg-[#9d9d9d] text-[#9d9d9d] rounded-xl">...</Skeleton>
            <Skeleton className="text-3xl bg-[#9d9d9d] text-[#9d9d9d] rounded-xl w-[60%]">
              ...
            </Skeleton>
            <Skeleton className="h-[150px] bg-[#9d9d9d] text-[#9d9d9d] rounded-xl">...</Skeleton>
            <Skeleton className="text-3xl bg-[#9d9d9d] text-[#9d9d9d] rounded-xl w-[80%]">
              ...
            </Skeleton>
            <Skeleton className="h-[200px] bg-[#9d9d9d] text-[#9d9d9d] rounded-xl">...</Skeleton>
            <Skeleton className="text-3xl bg-[#9d9d9d] text-[#9d9d9d] rounded-xl w-[60%] mx-auto">
              ...
            </Skeleton>
            <Skeleton className="h-[200px] bg-[#9d9d9d] text-[#9d9d9d] rounded-xl">...</Skeleton>
          </div>
          <hr className="color-[#ddd]" />
        </div>
        <BlogSidebarSkeleton table_of_contents />
      </section>
    </section>
  );
}
