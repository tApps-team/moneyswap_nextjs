import {
  AllArticlesSkeleton,
  BlogSidebarSkeleton,
  SliderOfArticlesSkeleton,
} from "@/widgets/strapi";
import { CategoriesListSkeleton } from "@/features/strapi";

export default function Loading() {
  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-semibold text-center max-w-[80%]">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <CategoriesListSkeleton />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <AllArticlesSkeleton />
        <BlogSidebarSkeleton />
      </div>
      <div className="pt-8 grid gap-[60px]">
        <SliderOfArticlesSkeleton />
        <SliderOfArticlesSkeleton />
      </div>
    </section>
  );
}
