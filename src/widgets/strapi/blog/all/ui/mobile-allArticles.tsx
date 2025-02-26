"use client";

import { FC, useState } from "react";
import { Pagination } from "@/features/pagination";
import { ShowMore } from "@/features/strapi";
import { Article, ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import { NoResultIcon } from "@/shared/assets";
import { routes } from "@/shared/router";

interface MobileAllArticlesProps {
  articles: Article[] | ArticlePreview[];
  totalPages?: number;
  page?: number;
}

export const MobileAllArticles: FC<MobileAllArticlesProps> = ({ articles, totalPages, page }) => {
  const [visibleCount, setVisibleCount] = useState(4);

  const isArticleArray = (articles: Article[] | ArticlePreview[]): articles is Article[] => {
    return articles?.length > 0 && (articles as Article[])[0]?.preview !== undefined;
  };

  const previewArticles: ArticlePreview[] = isArticleArray(articles)
    ? articles.map((art) => ({
        url_name: art?.url_name,
        title: art?.preview?.title,
        description: art?.preview?.description,
        image: art?.preview?.image,
        publishedAt: art?.publishedAt,
      }))
    : (articles as ArticlePreview[]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <section className="md:hidden mobile-xl:bg-new-dark-grey bg-transparent mobile-xl:rounded-[15px] mobile-xl:p-5 p-[0px] grid justify-items-center h-full w-full">
      {previewArticles?.length > 0 ? (
        <section className="grid grid-flow-row gap-5 w-full mobile-xl:pb-0 pb-2">
          <div className="grid grid-flow-row mobile-xl:gap-5 gap-3">
            {previewArticles.slice(0, visibleCount).map((art) => (
              <ArticlePreviewCard key={art.url_name} article={art} />
            ))}
          </div>
          {!page && !totalPages && visibleCount < previewArticles.length && (
            <div className="justify-self-center">
              <ShowMore onClick={handleShowMore} />
            </div>
          )}
          {page && totalPages && (
            <div className="justify-self-center">
              <Pagination currentPage={page} totalPages={totalPages} route={routes?.blog} />
            </div>
          )}
        </section>
      ) : (
        <div className="py-10  grid grid-flow-row gap-8 justify-center items-center">
          <p className="uppercase text-light-gray font-normal text-sm text-center">
            Ничего не найдено...
          </p>
          <div className="justify-self-center grayscale opacity-50 w-[60vw] max-w-[400px] h-full">
            <NoResultIcon />
          </div>
        </div>
      )}
    </section>
  );
};
