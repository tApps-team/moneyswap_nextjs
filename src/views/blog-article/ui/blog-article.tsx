import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, BlogSidebar, SimilarArticles } from "@/widgets/strapi";
import { SocialNetworks } from "@/features/social-networks";
import { ArticleDescription, MobileArticleSearch, TableOfContentsBlock } from "@/features/strapi";
import { getArticle, getCategoryArticles, getTagArticles } from "@/entities/strapi";
import { ArticleNavArrowIcon } from "@/shared/assets";
import { routes } from "@/shared/router";

export const BlogArticlePage = async ({ params }: { params: { url_name: string } }) => {
  const url = params.url_name;
  const { data: articles } = await getArticle({ url_name: url });

  if (articles.length === 0) {
    return notFound();
  }

  const article = articles[0];

  // Запросы для получения похожих статей по категориям и тегам
  const categoryPromises =
    article?.categories?.map((cat) => getCategoryArticles({ category: cat?.category || "" })) || [];
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

  // Удаляем дубликаты по ключу url_name
  const uniqueSimilarArticles = Array.from(
    new Map(allSimilarArticles.map((article) => [article.url_name, article])).values(),
  );

  const similarArticlesWithoutCurrent = uniqueSimilarArticles.filter((art) => art.url_name !== url);

  // Настраиваем формат даты
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Преобразуем дату
  const formattedDate = formatter.format(new Date(article?.publishedAt));

  return (
    <section className="grid grid-flow-cols md:gap-6 gap-3">
      <div className="md:grid md:grid-cols-[repeat(5,_auto)] flex flex-wrap gap-2 justify-start justify-items-start items-center uppercase text-[#b9b9b9] font-semibold xl:text-sm mobile:text-xs text-2xs truncate">
        <Link href={routes.home} className="hover:underline cursor-pointer">
          MONEYSWAP
        </Link>
        <ArticleNavArrowIcon className="mobile-xl:w-[14px] md:h-[14px] w-[10px] h-[10px]" />
        <Link href={routes.blog} className="inline lg:hidden hover:underline cursor-pointer">
          Статьи
        </Link>
        <ArticleNavArrowIcon className="inline lg:hidden md:w-[14px] md:h-[14px] w-[10px] h-[10px]" />
        <Link
          href={`${routes.blog}/${routes.tag}/${article?.tags[0]?.tag}`}
          className="hover:underline cursor-pointer"
        >
          {article?.tags[0]?.name}
        </Link>
        <ArticleNavArrowIcon className="hidden lg:inline mobile-xl:w-[14px] mobile-xl:h-[14px] w-[10px] h-[10px]" />
        <span className="hidden lg:inline truncate hover:underline cursor-pointer">
          {article?.preview?.title}
        </span>
      </div>
      <div className="grid grid-flow-rows md:gap-6 gap-3">
        <h1 className="uppercase xl:text-3xl lg:text-2xl md:text-xl mobile-xl:text-base mobile-xl:font-semibold text-sm font-medium text-start">
          {article?.article?.title}
        </h1>
        <p className="mobile-xl:text-white text-light-gray font-medium md:text-sm mobile:text-xs text-2xs uppercase tracking-widest">
          {formattedDate}
        </p>
      </div>
      <div className="grid md:grid-cols-[1fr_0.4fr] xl:gap-10 lg:gap-8 md:gap-6 items-start">
        <div className="grid grid-flow-rows md:gap-8 gap-4">
          <div className="grid grid-flow-row md:gap-6 lg:8 gap-0 md:bg-dark-gray bg-black lg:p-10 lg:pb-8 md:p-6 md:pb-4 p-0 pb-6 lg:rounded-[30px] rounded-[24px] shadow-[2px_2px_10px_3px_rgba(0,0,0,0.35)]">
            <div className="w-full h-auto xl:max-h-[calc(100vw_/_3.86)] max-h-[calc(100vw_/_2.381)] lg:rounded-[30px] rounded-[24px] overflow-hidden border-2 border-[#000]">
              <Image
                className="w-full h-full object-cover"
                src={article?.preview?.image}
                alt={article?.preview?.title}
                width={500}
                height={500}
              />
            </div>
            <ArticleDescription article={article} />
          </div>
          <MobileArticleSearch currentValue={null} />
          <div className="block md:hidden">
            <TableOfContentsBlock table_of_contents={article?.article?.table_of_contents} />
          </div>
          <ArticleContent dynamic_content={article?.article?.dynamic_content} />
          <hr className="color-light-gray" />
          <div className="grid grid-flow-row lg:gap-12 md:gap-8 gap-6 lg:pt-8 pt-4">
            <div className="flex flex-wrap md:gap-4 gap-1.5">
              {article?.tags?.map((tag) => (
                <Link
                  href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
                  key={tag?.id}
                  className="cursor-pointer uppercase text-2xs md:py-4 py-2 md:px-6 px-3 bg-dark-gray rounded-full md:border-2 border-[1px] border-light-gray text-light-gray hover:text-yellow-main hover:border-yellow-main transition-all duration-300"
                >
                  {tag?.name}
                </Link>
              ))}
            </div>
            <div className="grid grid-flow-row justify-center md:justify-start md:gap-6 gap-4">
              <p className="text-yellow-main uppercase lg:text-2xl md:text-xl text-base md:font-semibold font-medium text-center">
                Поделиться
              </p>
              <SocialNetworks />
            </div>
            {similarArticlesWithoutCurrent.length > 0 && (
              <SimilarArticles title="Похожие статьи" articles={similarArticlesWithoutCurrent} />
            )}
          </div>
        </div>
        <div className="md:block hidden sticky top-[90px] right-0">
          <BlogSidebar table_of_contents={article?.article?.table_of_contents} />
        </div>
      </div>
    </section>
  );
};
