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
    <section className="grid grid-flow-row md:gap-7 mobile-xl:gap-6 gap-5">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center mobile-xl:mx-auto mobile-xl:max-w-[80%]">
        <h1 className="uppercase xl:text-3xl lg:text-2xl md:text-xl mobile-xl:base mobile-xl:font-semibold mobile-xl:text-center text-sm font-medium text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <MobileArticleSearch currentValue={""} />
      <div className="mobile-xl:-my-7 block md:hidden">
        <SkeletonBotBanner />
      </div>
      <CategoriesListSkeleton />
      <div className="md:block hidden">
        <div className="grid md:grid-cols-[1fr_0.4fr] xl:gap-10 lg:gap-8 gap-6 items-start">
          <AllArticlesSkeleton />
          <BlogSidebarSkeleton />
        </div>
      </div>
      <MobileAllArticlesSkeleton />
      <div className="w-full mobile:grid hidden lg:pt-8 pt-0 mobile-xl:gap-10 gap-7 mobile-xl:w-[80%] md:w-full mx-auto">
        <SliderOfArticlesSkeleton />
        <SliderOfArticlesSkeleton />
      </div>
    </section>
  );
}
