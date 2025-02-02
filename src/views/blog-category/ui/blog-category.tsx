import { AllArticles, BlogSidebar, MobileAllArticles } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { CategoriesList, MobileArticleSearch, MobileTagsList } from "@/features/strapi";
import { getAllCategories, getCategoryArticles } from "@/entities/strapi";

export const BlogCategoryPage = async ({ params }: { params: { category: string } }) => {
  const category = params.category;
  const { data: articles } = await getCategoryArticles({ category });
  const { data: categories } = await getAllCategories();
  return (
    <section className="grid grid-flow-row md:gap-7 mobile-xl:gap-6 gap-5">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center mobile-xl:mx-auto mobile-xl:max-w-[80%]">
        <h1 className="sr-only md:not-sr-only md:block hidden uppercase xl:text-3xl lg:text-2xl text-xl font-normal text-center">
          {articles?.name}
        </h1>
        <h1 className="not-sr-only md:sr-only md:hidden block uppercase mobile-xl:text-base mobile-xl:font-normal mobile-xl:text-center text-sm font-normal text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <MobileArticleSearch currentValue={null} />
      <div className="-my-7 md:hidden block">
        <BotBanner />
      </div>
      <CategoriesList categories={categories?.categories} selectedCategory={category} />
      <div className="md:block hidden">
        <div className="grid md:grid-cols-[1fr_0.4fr] xl:gap-10 lg:gap-8 gap-6 items-start">
          <AllArticles articles={articles?.articles} />
          <div className="sticky top-[90px] right-0">
            <BlogSidebar />
          </div>
        </div>
      </div>
      <MobileAllArticles articles={articles?.articles} />
      <MobileTagsList />
    </section>
  );
};
