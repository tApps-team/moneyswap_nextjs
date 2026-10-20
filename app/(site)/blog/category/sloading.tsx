import { AllArticlesSkeleton, BlogSidebarSkeleton } from "@/widgets/strapi";
import { CategoriesListSkeleton } from "@/features/strapi";

export default function Loading() {
  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-medium text-center w-[20%] bg-skeleton-gray text-skeleton-gray mx-auto rounded-xl">
          ...
        </h1>
      </div>
      <CategoriesListSkeleton />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <AllArticlesSkeleton />
        <BlogSidebarSkeleton />
      </div>
    </section>
  );
}
