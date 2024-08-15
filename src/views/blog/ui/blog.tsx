import { BlogSidebar, PopularArticles, ReadersChoice, RecommendedArticles } from "@/widgets/blog";
import { CategoriesList } from "@/features/blog";
import { getAllCategories, getAllTags, getTopicArticles, topics } from "@/entities/blog";

export const BlogPage = async () => {
  const { data: popular } = await getTopicArticles({ topic: topics.main_topics });
  const { data: readersChoice } = await getTopicArticles({ topic: topics.readers_choice });
  const { data: recommended } = await getTopicArticles({ topic: topics.platform_recommended });
  const { data: categories } = await getAllCategories();
  const { data: tags } = await getAllTags();
  console.log(popular);
  console.log(readersChoice);
  console.log(recommended);
  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-semibold text-center max-w-[80%]">
          Блог о финансах, криптовалюте и переводах зарубеж
        </h1>
      </div>
      <CategoriesList categories={categories?.categories} />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <PopularArticles articles={popular?.articles} />
        <BlogSidebar />
      </div>
      <ReadersChoice title={readersChoice?.name} articles={readersChoice?.articles} />
      <RecommendedArticles title={recommended?.name} articles={recommended?.articles} />
    </section>
  );
};
