import { BlogSidebarSkeleton } from "@/widgets/strapi";
import { MobileArticleSearch, TableOfContentsBlockSkeleton } from "@/features/strapi";
import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <section className="grid grid-flow-cols mobile-xl:gap-6 gap-3">
      {/* <Skeleton className="bg-skeleton-gray text-skeleton-gray grid grid-cols-[repeat(5,_auto)] gap-2 justify-start justify-items-start items-center uppercase font-semibold text-sm w-[70%]">
        ...
      </Skeleton>
      <div className="grid grid-flow-rows mobile-xl:gap-6 gap-3">
        <Skeleton className="bg-skeleton-gray text-skeleton-gray mobile-xl:text-3xl text-sm font-medium uppercase w-[90%]">
          ...
        </Skeleton>
        <Skeleton className="mobile-xl:block hidden bg-skeleton-gray text-skeleton-gray mobile-xl:text-3xl text-sm font-medium uppercase w-[60%]">
          ...
        </Skeleton>
        <Skeleton className="bg-skeleton-gray text-skeleton-gray font-medium text-sm uppercase tracking-widest w-[30%]">
          ...
        </Skeleton>
      </div>
      <section className="grid mobile-xl:grid-cols-[1fr_0.4fr] grid-cols-1 mobile-xl:gap-10 gap-0 items-start">
        <div className="grid grid-flow-rows mobile-xl:gap-8 gap-4">
          <div className="grid grid-flow-row mobile-xl:gap-8 gap-0 mobile-xl:bg-dark-gray bg-black mobile-xl:p-10 mobile-xl:pb-8 p-0 pb-6 rounded-[35px] shadow-[2px_2px_10px_3px_rgba(0,0,0,0.35)]">
            <div className="w-full mobile-xl:h-[30vw] h-[40vw] mobile-xl:max-h-[800px] max-h-[400px] rounded-[35px] overflow-hidden">
              <Skeleton className="bg-skeleton-gray text-skeleton-gray w-full h-full object-cover">
                ...
              </Skeleton>
            </div>
            <div className="grid gap-2 mobile-xl:p-0 px-6 pt-4">
              <Skeleton className="mobile-xl:text-sm text-2xs uppercase bg-skeleton-gray text-skeleton-gray w-[80%]">
                ...
              </Skeleton>
              <Skeleton className="mobile-xl:text-sm text-2xs uppercase bg-skeleton-gray text-skeleton-gray">
                ...
              </Skeleton>
              <Skeleton className="mobile-xl:text-sm text-2xs uppercase bg-skeleton-gray text-skeleton-gray w-[30%]">
                ...
              </Skeleton>
            </div>
          </div>
          <MobileArticleSearch currentValue={null} />
          <TableOfContentsBlockSkeleton />
          <div className="grid mobile-xl:gap-10 gap-6">
            <Skeleton className="h-[200px] bg-skeleton-gray text-skeleton-gray rounded-xl">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[60%]">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[90%]">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[30%]">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[50%]">
              ...
            </Skeleton>
            <Skeleton className="h-[150px] bg-skeleton-gray text-skeleton-gray rounded-xl">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[80%]">
              ...
            </Skeleton>
            <Skeleton className="h-[200px] bg-skeleton-gray text-skeleton-gray rounded-xl">
              ...
            </Skeleton>
            <Skeleton className="mobile-xl:text-3xl text-sm bg-skeleton-gray text-skeleton-gray rounded-xl w-[60%] mx-auto">
              ...
            </Skeleton>
            <Skeleton className="h-[200px] bg-skeleton-gray text-skeleton-gray rounded-xl">
              ...
            </Skeleton>
          </div>
          <hr className="color-[#ddd]" />
        </div>
        <div className="mobile-xl:block hidden">
          <BlogSidebarSkeleton table_of_contents />
        </div>
      </section> */}
    </section>
  );
}
