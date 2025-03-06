"use client";

import { FC, useState } from "react";
import { Pagination } from "@/features/pagination";
import { ShowMore } from "@/features/strapi";
import { Article, ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import { NoResultIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { NoResults } from "@/shared/ui";

interface AllArticlesProps {
  articles: Article[] | ArticlePreview[];
  totalPages?: number;
  page?: number;
}

export const AllArticles: FC<AllArticlesProps> = ({ articles, totalPages, page }) => {
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
    <section className="grid h-full w-full">
      {previewArticles?.length > 0 ? (
        <section className="grid grid-rows-[1fr_auto] gap-8 xl:p-8 lg:p-5 p-6 lg:rounded-[15px] rounded-[10px] bg-new-dark-grey">
          <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 xl:gap-5 gap-3">
            {previewArticles.slice(0, visibleCount).map((art) => (
              <ArticlePreviewCard key={art.url_name} article={art} />
            ))}
            {previewArticles?.length % 2 !== 0 && visibleCount >= previewArticles?.length && (
              <NoResults className="h-fit w-full flex flex-col justify-center items-center opacity-50 rounded-[20px]" />
            )}
            {previewArticles?.length % 2 === 0 && previewArticles?.length < 4 && (
              <NoResults className="h-fit w-full flex flex-col justify-center items-center opacity-50 rounded-[20px]" />
            )}
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
        <div className="justify-self-center grayscale opacity-50 flex justify-center items-center w-[40vw] max-w-[400px] h-full ">
          <NoResultIcon />
        </div>
      )}
    </section>
  );
};
