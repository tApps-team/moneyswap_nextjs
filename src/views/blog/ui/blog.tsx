import { AllArticles, BlogSidebar, MobileAllArticles, SliderOfArticles } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
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
    <section className="grid grid-flow-row mobile-xl:gap-[40px] gap-7">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center">
        <h1 className="uppercase mobile-xl:text-3xl mobile-xl:font-semibold mobile-xl:text-center mobile-xl:max-w-[80%] mobile:text-lg text-sm font-medium text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <MobileArticleSearch currentValue={searchValue || null} />
      <div className="-my-7 mobile-xl:hidden block">
        <BotBanner />
      </div>
      <CategoriesList categories={categories?.categories} />
      <div className="mobile-xl:block hidden">
        <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
          <AllArticles articles={all} totalPages={totalPages} page={page} />
          <BlogSidebar searchValue={searchValue} isMain />
        </div>
      </div>
      <MobileAllArticles articles={all} totalPages={totalPages} page={page} />
      <div className="mobile-xl:pt-8 pt-0 grid mobile-xl:gap-[60px] gap-7">
        <SliderOfArticles title={readersChoice?.name} articles={readersChoice?.articles} />
        <SliderOfArticles title={recommended?.name} articles={recommended?.articles} />
      </div>
      <MobileTagsList />
    </section>
  );
};
