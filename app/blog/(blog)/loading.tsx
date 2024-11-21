import {
  AllArticlesSkeleton,
  BlogSidebarSkeleton,
  MobileAllArticlesSkeleton,
  SliderOfArticlesSkeleton,
} from "@/widgets/strapi";
import { SkeletonBotBanner } from "@/features/bot-banner";
import { CategoriesListSkeleton, MobileArticleSearch } from "@/features/strapi";

export default function Loading() {
  return (
    <section className="grid grid-flow-row mobile-xl:gap-[40px] gap-7">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center">
        <h1 className="uppercase mobile-xl:text-3xl mobile-xl:font-semibold mobile-xl:text-center mobile-xl:max-w-[80%] mobile:text-lg text-sm font-medium text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <MobileArticleSearch currentValue={""} />
      <div className="block mobile-xl:hidden">
        <SkeletonBotBanner />
      </div>
      <CategoriesListSkeleton />
      <div className="mobile-xl:block hidden">
        <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
          <AllArticlesSkeleton />
          <BlogSidebarSkeleton />
        </div>
      </div>
      <MobileAllArticlesSkeleton />
      <div className="hidden mobile-xl:grid pt-8 gap-[60px]">
        <SliderOfArticlesSkeleton />
        <SliderOfArticlesSkeleton />
      </div>
    </section>
  );
}
