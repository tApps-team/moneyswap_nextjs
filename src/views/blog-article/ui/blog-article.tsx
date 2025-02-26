import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, BlogSidebar, SimilarArticles } from "@/widgets/strapi";
import { SocialNetworks } from "@/features/social-networks";
import { ArticleDescription, MobileArticleSearch, TableOfContentsBlock } from "@/features/strapi";
import { getArticle, getCategoryArticles, getTagArticles } from "@/entities/strapi";
import { ArticleNavArrowIcon, ShareIcon } from "@/shared/assets";
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
    <section className="grid grid-flow-cols lg:gap-10 gap-5">
      <div className="mobile-xl:bg-new-dark-grey bg-transparent w-fit mobile-xl:px-4 mobile-xl:py-3 p-0 mobile-xl:rounded-[10px] md:grid md:grid-cols-[repeat(5,_auto)] flex flex-wrap gap-2 justify-start justify-items-start items-center uppercase mobile-xl:text-font-light-grey text-font-dark-grey font-normal xl:text-sm mobile:text-xs text-2xs truncate">
        <Link href={routes.home} className="hover:underline cursor-pointer">
          MONEYSWAP
        </Link>
        <ArticleNavArrowIcon className="mobile-xl:w-[10px] md:h-[10px] w-[6px] h-[6px]" />
        <Link href={routes.blog} className="inline lg:hidden hover:underline cursor-pointer">
          Статьи
        </Link>
        <ArticleNavArrowIcon className="inline lg:hidden md:w-[10px] md:h-[10px] w-[6px] h-[6px]" />
        <Link
          href={`${routes.blog}/${routes.tag}/${article?.tags[0]?.tag}`}
          className="hover:underline cursor-pointer"
        >
          {article?.tags[0]?.name}
        </Link>
        <ArticleNavArrowIcon className="hidden lg:inline mobile-xl:w-[10px] mobile-xl:h-[10px] w-[6px] h-[6px]" />
        <span className="hidden lg:inline truncate hover:underline cursor-pointer normal-case">
          {article?.preview?.title}
        </span>
      </div>
      <div className="grid grid-flow-rows md:gap-2 gap-1 mobile-xl:mt-0 -mt-3">
        <h1 className="text-yellow-main uppercase xl:text-[28px] lg:text-2xl md:text-xl text-base font-bold text-start">
          {article?.article?.title}
        </h1>
        <p className="mobile-xl:text-font-light-grey text-font-dark-grey font-normal md:text-sm mobile:text-xs text-2xs tracking-wider">
          {formattedDate}
        </p>
      </div>
      <div className="grid md:grid-cols-[1fr_0.4fr] md:gap-5 items-start">
        <div className="grid grid-flow-rows lg:gap-8 gap-5">
          <div className="grid grid-flow-row lg:gap-8 mobile-xl:gap-5 gap-4 bg-new-dark-grey lg:p-8 md:p-6 md:pb-4 mobile-xl:p-6 p-2 lg:rounded-[20px] rounded-[15px]">
            <div className="w-full h-auto xl:max-h-[calc(100vw_/_3.86)] max-h-[calc(100vw_/_2.381)] lg:rounded-[20px] rounded-[15px] overflow-hidden">
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
          <div className="grid grid-flow-row md:gap-5 gap-4">
            <div className="flex flex-wrap md:gap-3 gap-1.5">
              {article?.tags?.map((tag) => (
                <Link
                  href={`${routes.blog}${routes.tag}/${tag?.tag}`}
                  key={tag?.id}
                  className="cursor-pointer md:text-sm text-xs md:py-4 py-2 md:px-6 px-3 bg-new-grey mobile-xl:rounded-[10px] rounded-[7px] text-white hover:bg-new-light-grey transition-all duration-300"
                >
                  {tag?.name}
                </Link>
              ))}
            </div>
            <div className="bg-new-grey p-3 rounded-[10px] grid grid-flow-col justify-start md:gap-6 gap-4 w-fit">
              <div className="md:pl-4 pl-2 grid grid-flow-col md:gap-4 gap-3 justify-start items-center">
                <div className="[&>svg]:w-4">
                  <ShareIcon />
                </div>
                <p className="text-yellow-main uppercase lg:text-base md:text-sm text-xs font-normal">
                  Поделиться
                </p>
              </div>
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
