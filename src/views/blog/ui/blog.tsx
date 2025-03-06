import { AllArticles, BlogSidebar, MobileAllArticles, SliderOfArticles } from "@/widgets/strapi";
import { BotBannerBlog } from "@/features/bot-banner";
import { CategoriesList, MobileArticleSearch, MobileTagsList } from "@/features/strapi";
import { getAllArticles, getAllCategories, getTopicArticles, topics } from "@/entities/strapi";

export const BlogPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? Number(searchParams?.page) : 1;
  const searchValue = searchParams.search ? searchParams.search.toString() : null;
  const elements = 4;

  const { data: all, meta } = await getAllArticles({ page, elements, searchValue });
  const { data: readersChoice } = await getTopicArticles({ topic: topics.readers_choice });
  const { data: recommended } = await getTopicArticles({ topic: topics.platform_recommended });
  const { data: categories } = await getAllCategories();

  const totalPages = Math.ceil(meta?.pagination?.total / elements);

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
