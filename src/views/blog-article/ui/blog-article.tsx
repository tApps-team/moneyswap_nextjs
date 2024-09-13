import { ArticleContent, BlogSidebar, SimilarArticles } from "@/widgets/blog";
import { getArticle, getCategoryArticles, getTagArticles } from "@/entities/strapi";

export const BlogArticlePage = async ({ params }: { params: { url_name: string } }) => {
  const url = params.url_name;
  const { data: articles } = await getArticle({ url_name: url });
  const article = articles[0];

  // Запросы для получения похожих статей по категориям и тегам
  const categoryPromises =
    article?.categories?.map((cat) => getCategoryArticles({ category: cat?.category })) || [];

  const tagPromises = article?.tags?.map((tag) => getTagArticles({ tag: tag?.tag })) || [];

  // Ожидаем выполнения всех запросов
  const [categoryResults, tagResults] = await Promise.all([
    Promise.all(categoryPromises),
    Promise.all(tagPromises),
  ]);

  // Собираем похожие статьи
  const similarArticlesFromCategories = categoryResults.flatMap((result) => result?.data?.articles);
  const similarArticlesFromTags = tagResults.flatMap((result) => result?.data?.articles);

  // Объединяем все похожие статьи в один массив
  const allSimilarArticles = [...similarArticlesFromCategories, ...similarArticlesFromTags];

  return (
    <section className="grid grid-flow-rows gap-6">
      <div className="grid grid-flow-rows gap-6">
        <h1 className="text-3xl font-medium uppercase max-w-[100%]">{article?.preview?.title}</h1>
        <p className="text-[#bbbbbb] font-medium text-sm uppercase">{article?.publishedAt}</p>
      </div>
      <section className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <div className="grid grid-flow-rows gap-10">
          <div className="w-full h-auto max-h-[1000px] rounded-[35px] overflow-hidden">
            <img
              className="w-full h-full object-contain"
              src={article?.preview?.image}
              alt={article?.preview?.title}
            />
          </div>
          <ArticleContent dynamic_content={article?.article?.dynamic_content} />
          <hr className="color-[#ddd]" />
          {allSimilarArticles.length > 0 && (
            <SimilarArticles title="Похожие статьи" articles={allSimilarArticles} />
          )}
        </div>
        <BlogSidebar table_of_contents={article?.article?.table_of_contents} />
      </section>
    </section>
  );
};
