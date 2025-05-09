import { AllArticles, BlogSidebar, MobileAllArticles } from "@/widgets/strapi";
import { BotBanner, BotBannerBlog } from "@/features/bot-banner";
import { CategoriesList, MobileArticleSearch, MobileTagsList } from "@/features/strapi";
import { getAllCategories, getCategoryArticles } from "@/entities/strapi";

export const BlogCategoryPage = async ({ params }: { params: { category: string } }) => {
  const category = params.category;
  
  // Выполняем запросы параллельно
  const [articlesResponse, categoriesResponse] = await Promise.all([
    getCategoryArticles({ category }),
    getAllCategories()
  ]);

  const { data: articles } = articlesResponse;
  const { data: categories } = categoriesResponse;

  return (
    <section className="grid grid-flow-row md:gap-[50px] mobile-xl:gap-10 gap-5">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center mobile-xl:mx-auto lg:max-w-[70%] mobile-xl:max-w-full">
        <h1 className="text-yellow-main sr-only md:not-sr-only md:block hidden uppercase xl:text-3xl lg:text-2xl text-xl font-normal text-center">
          {articles?.name}
        </h1>
        <h1 className="md:hidden block text-yellow-main uppercase md:text-3xl mobile-xl:text-2xl text-base font-bold mobile-xl:text-center text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <div className="md:hidden block">
        <BotBannerBlog />
      </div>
      <MobileArticleSearch currentValue={null} />
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
