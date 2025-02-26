import {
  AllArticlesSkeleton,
  BlogSidebarSkeleton,
  MobileAllArticlesSkeleton,
  SliderOfArticlesSkeleton,
} from "@/widgets/strapi";
import { SkeletonBotBannerBlog } from "@/features/bot-banner";
import { CategoriesListSkeleton, MobileArticleSearch } from "@/features/strapi";

export default function Loading() {
  return (
    <section className="grid grid-flow-row md:gap-7 mobile-xl:gap-6 gap-5">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center mobile-xl:mx-auto mobile-xl:max-w-[80%]">
        <h1 className="text-yellow-main uppercase md:text-3xl mobile-xl:text-2xl text-base font-bold mobile-xl:text-center text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <div className="md:hidden block">
        <SkeletonBotBannerBlog />
      </div>
      <MobileArticleSearch currentValue={""} />
      <CategoriesListSkeleton />
      <div className="md:block hidden">
        <div className="grid md:grid-cols-[1fr_0.4fr] xl:gap-10 lg:gap-8 gap-6 items-start">
          <AllArticlesSkeleton />
          <BlogSidebarSkeleton />
        </div>
      </div>
      <MobileAllArticlesSkeleton />
      {/* <div className="lg:pt-8 pt-0 grid mobile-xl:gap-10 gap-5 w-full">
        <SliderOfArticlesSkeleton />
        <SliderOfArticlesSkeleton />
      </div> */}
    </section>
  );
}
