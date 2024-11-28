import { AllArticles, BlogSidebar, MobileAllArticles } from "@/widgets/strapi";
import { BotBanner } from "@/features/bot-banner";
import { CategoriesList, MobileArticleSearch, MobileTagsList } from "@/features/strapi";
import { getAllCategories, getTagArticles } from "@/entities/strapi";

export const BlogTagPage = async ({ params }: { params: { tag: string } }) => {
  const tag = params.tag;
  const { data: articles } = await getTagArticles({ tag });
  const { data: categories } = await getAllCategories();
  return (
    <section className="grid grid-flow-row mobile-xl:gap-[40px] gap-7">
      <div className="mobile-xl:flex mobile-xl:justify-center mobile-xl:items-center">
        <h1 className="mobile-xl:block hidden uppercase xl:text-3xl lg:text-2xl md:text-xl mobile-xl:text-lg mobile-xl:font-semibold mobile-xl:text-center mobile-xl:max-w-[80%] text-lg font-medium text-start">
          {articles?.name}
        </h1>
        <h1 className="mobile-xl:hidden block uppercase mobile-xl:text-3xl mobile-xl:font-semibold mobile-xl:text-center mobile-xl:max-w-[80%] mobile:text-lg text-sm font-medium text-start">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <MobileArticleSearch currentValue={null} />
      <div className="-my-7 mobile-xl:hidden block">
        <BotBanner />
      </div>
      <CategoriesList categories={categories?.categories} selectedTag={articles?.name} />
      <div className="mobile-xl:block hidden">
        <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
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
