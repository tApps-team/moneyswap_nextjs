import { AllArticles, BlogSidebar, MobileAllArticles, SliderOfArticles } from "@/widgets/strapi";
import { BotBannerBlog } from "@/features/bot-banner";
import { CategoriesList, MobileArticleSearch, MobileTagsList } from "@/features/strapi";
import { getAllArticles, getAllCategories, getTopicArticles, topics } from "@/entities/strapi";

const measureTime = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  // console.log(`[API Performance] ${name} took ${end - start}ms`);
  return result;
};

export const BlogPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? Number(searchParams?.page) : 1;
  const searchValue = searchParams.search ? searchParams.search.toString() : null;
  const elements = 4;

  console.time('Total API Requests');
  
  // Выполняем все запросы параллельно
  const [
    articlesResponse,
    readersChoiceResponse,
    recommendedResponse,
    categoriesResponse
  ] = await Promise.all([
    measureTime("getAllArticles", () => getAllArticles({ page, elements, searchValue })),
    measureTime("getTopicArticles(readers_choice)", () => getTopicArticles({ topic: topics.readers_choice })),
    measureTime("getTopicArticles(platform_recommended)", () => getTopicArticles({ topic: topics.platform_recommended })),
    measureTime("getAllCategories", () => getAllCategories())
  ]);

  console.timeEnd('Total API Requests');

  const { data: all, meta } = articlesResponse;
  const { data: readersChoice } = readersChoiceResponse;
  const { data: recommended } = recommendedResponse;
  const { data: categories } = categoriesResponse;

  const totalPages = meta?.pagination?.pageCount;

  return (
    <section className="grid grid-flow-row md:gap-[50px] mobile-xl:gap-10 gap-5">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center mobile-xl:mx-auto lg:max-w-[70%] mobile-xl:max-w-full">
        <h1 className="text-yellow-main uppercase md:text-3xl mobile-xl:text-2xl text-base font-bold mobile-xl:text-center text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <div className="md:hidden block">
        <BotBannerBlog />
      </div>
      <MobileArticleSearch currentValue={searchValue || null} />
      <CategoriesList categories={categories?.categories} />
      <div className="md:block hidden">
        <div className="grid md:grid-cols-[1fr_0.4fr] xl:gap-10 lg:gap-8 gap-6 items-start">
          <AllArticles articles={all} totalPages={totalPages} page={page} />
          <BlogSidebar searchValue={searchValue} isMain />
        </div>
      </div>
      <MobileAllArticles articles={all} totalPages={totalPages} page={page} />
      <div className="lg:pt-8 pt-0 grid mobile-xl:gap-10 gap-5 w-full">
        <SliderOfArticles title={readersChoice?.name} articles={readersChoice?.articles} />
        <SliderOfArticles title={recommended?.name} articles={recommended?.articles} />
      </div>
      <MobileTagsList />
    </section>
  );
};
