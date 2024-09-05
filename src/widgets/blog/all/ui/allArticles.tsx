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
    return (articles as Article[])[0]?.preview !== undefined;
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
    <section className="flex justify-center items-center">
      {previewArticles?.length > 0 ? (
        <section className="grid grid-flow-row gap-8">
          <div className="p-8 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d]">
            <div className="grid grid-cols-2 gap-8">
              {previewArticles.slice(0, visibleCount).map((art) => (
                <ArticlePreviewCard key={art.url_name} article={art} />
              ))}
              {previewArticles?.length % 2 !== 0 && visibleCount >= previewArticles?.length && (
                <NoResults className="flex flex-col justify-center items-center opacity-50 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] border-2 border-[rgba(0,0,0,0)]" />
              )}
            </div>
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
        <div className="grayscale opacity-50 flex justify-center items-center w-[40vw] max-w-[600px] p-[6%] pt-[10vw]">
          <NoResultIcon />
        </div>
      )}
    </section>
  );
};
