import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { ArticleContent, BlogSidebar, SimilarArticles } from "@/widgets/strapi";
import { getArticle, getCategoryArticles, getTagArticles } from "@/entities/strapi";
import { ArticleNavArrowIcon, FacebookIcon, TgIcon, YoutubeIcon } from "@/shared/assets";
import { routes } from "@/shared/router";

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
  },
};

export const BlogArticlePage = async ({ params }: { params: { url_name: string } }) => {
  const url = params.url_name;
  const { data: articles } = await getArticle({ url_name: url });
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

  // Настраиваем формат даты
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Преобразуем дату
  const formattedDate = formatter.format(new Date(article?.publishedAt));

  return (
    <section className="grid grid-flow-cols gap-6">
      <div className="grid grid-cols-[repeat(5,_auto)] gap-2 justify-start justify-items-start items-center uppercase text-[#b9b9b9] font-semibold text-sm">
        <Link href={routes.home} className="hover:underline cursor-pointer">
          MONEYSWAP
        </Link>
        <ArticleNavArrowIcon className="w-[14px] h-[14px]" />
        <Link
          href={`${routes.blog}/${routes.tag}/${article?.tags[0]?.tag}`}
          className="hover:underline cursor-pointer"
        >
          {article?.tags[0]?.name}
        </Link>
        <ArticleNavArrowIcon className="w-[14px] h-[14px]" />
        <span className="truncate hover:underline cursor-pointer">{article?.preview?.title}</span>
      </div>
      <div className="grid grid-flow-rows gap-6">
        <h1 className="text-3xl font-medium uppercase max-w-[100%]">{article?.article?.title}</h1>
        <p className="text-[#fff] font-medium text-sm uppercase tracking-widest">{formattedDate}</p>
      </div>
      <section className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <div className="grid grid-flow-rows gap-8">
          <div className="grid grid-flow-row gap-8 bg-dark-gray p-10 pb-8 rounded-[35px] shadow-[2px_2px_10px_3px_rgba(0,0,0,0.35)]">
            <div className="w-full h-auto max-h-[1000px] rounded-[35px] overflow-hidden border-2 border-[#000]">
              <Image
                className="w-full h-full object-contain"
                src={article?.preview?.image}
                alt={article?.preview?.title}
                width={500}
                height={500}
              />
            </div>
            {/* <div
              className="text-sm uppercase"
              dangerouslySetInnerHTML={{ __html: article?.article?.description }}
            /> */}
            <div className="text-sm uppercase">{parse(article?.article?.description, options)}</div>
          </div>
          <ArticleContent
            dynamic_content={article?.article?.dynamic_content}
            url={article?.url_name}
          />
          <hr className="color-[#ddd]" />
          <div className="grid grid-flow-row gap-12 pt-[30px]">
            <div className="flex flex-wrap gap-4">
              {article?.tags?.map((tag) => (
                <Link
                  href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
                  key={tag?.id}
                  className="cursor-pointer uppercase text-[10px] py-4 px-6 bg-dark-gray rounded-full border-2 border-[#ddd] text-[#b9b9b9] hover:text-yellow-main hover:border-yellow-main transition-all duration-300"
                >
                  {tag?.name}
                </Link>
              ))}
            </div>
            <div className="grid grid-flow-row gap-6">
              <p className="text-yellow-main uppercase text-2xl font-semibold">Поделиться</p>
              <div className="grid grid-flow-col gap-2 justify-start justify-items-start">
                <div className="w-[30px] h-[30px] &>svg-w-full &>svg-h-full cursor-pointer">
                  <TgIcon />
                </div>
                <div className="w-[30px] h-[30px] &>svg-w-full &>svg-h-full cursor-pointer">
                  <FacebookIcon />
                </div>
                <div className="w-[30px] h-[30px] &>svg-w-full &>svg-h-full cursor-pointer">
                  <YoutubeIcon />
                </div>
              </div>
            </div>
            {uniqueSimilarArticles.length > 0 && (
              <SimilarArticles title="Похожие статьи" articles={uniqueSimilarArticles} />
            )}
          </div>
        </div>
        <BlogSidebar table_of_contents={article?.article?.table_of_contents} />
      </section>
    </section>
  );
};
