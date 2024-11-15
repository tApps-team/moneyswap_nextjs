import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, BlogSidebar, SimilarArticles } from "@/widgets/strapi";
import { getArticle, getCategoryArticles, getTagArticles } from "@/entities/strapi";
import { ArticleNavArrowIcon, FacebookIcon, TgIcon, YoutubeIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import searchAnimation from "/public/animated/search_spin.gif";
import { MobileArticleSearch, TableOfContentsBlock } from "@/features/strapi";

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
    if (domNode instanceof Element && domNode.name === "br") {
      return <hr />;
    }
  },
};

export const BlogArticlePage = async ({ params }: { params: { url_name: string } }) => {
  const url = params.url_name;
  const { data: articles } = await getArticle({ url_name: url });

  if (articles.length === 0) {
    // return (
    //   <div className="w-full h-[90dvh] flex flex-col justify-center items-center gap-10">
    //     <Image src={searchAnimation} alt="search spin" className="w-[10vw] h-[10vw]" />
    //     <p className="uppercase text-2xl font-semibold">Статья не найдена</p>
    //     <Link href={routes.blog} className="grid justify-center items-center mt-[100px]">
    //       <button className="uppercase px-10 py-6 rounded-full bg-yellow-main text-dark-gray font-semibold text-xl">
    //         Вернуться в блог
    //       </button>
    //     </Link>
    //   </div>
    // );
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
    <section className="grid grid-flow-cols mobile-xl:gap-6 gap-3">
      <div className="mobile-xl:grid mobile-xl:grid-cols-[repeat(5,_auto)] flex flex-wrap gap-2 justify-start justify-items-start items-center uppercase text-[#b9b9b9] font-semibold mobile-xl:text-sm mobile:text-xs text-2xs">
        <Link href={routes.home} className="hover:underline cursor-pointer">
          MONEYSWAP
        </Link>
        <ArticleNavArrowIcon className="mobile-xl:w-[14px] mobile-xl:h-[14px] w-[10px] h-[10px]" />
        <Link href={routes.blog} className="inline mobile-xl:hidden hover:underline cursor-pointer">
          Статьи
        </Link>
        <ArticleNavArrowIcon className="inline mobile-xl:hidden mobile-xl:w-[14px] mobile-xl:h-[14px] w-[10px] h-[10px]" />
        <Link
          href={`${routes.blog}/${routes.tag}/${article?.tags[0]?.tag}`}
          className="hover:underline cursor-pointer"
        >
          {article?.tags[0]?.name}
        </Link>
        <ArticleNavArrowIcon className="hidden mobile-xl:inline mobile-xl:w-[14px] mobile-xl:h-[14px] w-[10px] h-[10px]" />
        <span className="hidden mobile-xl:inline truncate hover:underline cursor-pointer">
          {article?.preview?.title}
        </span>
      </div>
      <div className="grid grid-flow-rows mobile-xl:gap-6 gap-3">
        <h1 className="mobile-xl:text-3xl mobile:text-lg text-sm font-medium uppercase max-w-[100%]">
          {article?.article?.title}
        </h1>
        <p className="mobile-xl:text-white text-light-gray font-medium mobile-xl:text-sm mobile:text-xs text-2xs uppercase tracking-widest">
          {formattedDate}
        </p>
      </div>
      <section className="grid mobile-xl:grid-cols-[1fr_0.4fr] grid-cols-1 mobile-xl:gap-10 gap-0 items-start">
        <div className="grid grid-flow-rows mobile-xl:gap-8 gap-4">
          <div className="grid grid-flow-row mobile-xl:gap-8 gap-0 mobile-xl:bg-dark-gray bg-black mobile-xl:p-10 mobile-xl:pb-8 p-0 pb-6 rounded-[35px] shadow-[2px_2px_10px_3px_rgba(0,0,0,0.35)]">
            <div className="w-full h-auto max-h-[1000px] rounded-[35px] overflow-hidden border-2 border-[#000]">
              <Image
                className="w-full h-full object-contain"
                src={article?.preview?.image}
                alt={article?.preview?.title}
                width={500}
                height={500}
              />
            </div>
            <div className="mobile-xl:overflow-visible overflow-y-auto mobile-xl:max-h-full max-h-[20svh] mobile-xl:p-0 px-6 pt-4 text-sm uppercase strapi_styles strapi_fonts_codec">
              {parse(article?.article?.description, options)}
            </div>
          </div>
          <MobileArticleSearch currentValue={null} />
          <div className="block mobile-xl:hidden">
            <TableOfContentsBlock table_of_contents={article?.article?.table_of_contents} />
          </div>
          <ArticleContent dynamic_content={article?.article?.dynamic_content} />
          <hr className="color-light-gray" />
          <div className="grid grid-flow-row mobile-xl:gap-12 gap-6 mobile-xl:pt-8 pt-4">
            <div className="flex flex-wrap mobile-xl:gap-4 gap-1.5">
              {article?.tags?.map((tag) => (
                <Link
                  href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
                  key={tag?.id}
                  className="cursor-pointer uppercase text-2xs mobile-xl:py-4 py-2 mobile-xl:px-6 px-3 bg-dark-gray rounded-full mobile-xl:border-2 border-[1px] border-light-gray text-light-gray hover:text-yellow-main hover:border-yellow-main transition-all duration-300"
                >
                  {tag?.name}
                </Link>
              ))}
            </div>
            <div className="grid grid-flow-row justify-center mobile-xl:justify-start mobile-xl:gap-6 gap-4">
              <p className="text-yellow-main uppercase mobile-xl:text-2xl text-md mobile-xl:font-semibold font-medium">
                Поделиться
              </p>
              <div className="grid grid-flow-col gap-2 mobile-xl:justify-start justify-center justify-items-start">
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
            {similarArticlesWithoutCurrent.length > 0 && (
              <SimilarArticles title="Похожие статьи" articles={similarArticlesWithoutCurrent} />
            )}
          </div>
        </div>
        <div className="mobile-xl:block hidden sticky top-[90px] right-0">
          <BlogSidebar table_of_contents={article?.article?.table_of_contents} />
        </div>
      </section>
    </section>
  );
};
