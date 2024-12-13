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
    <section className="grid justify-items-center h-full w-full md:hidden">
      {previewArticles?.length > 0 ? (
        <section className="grid grid-flow-row gap-7 mobile-xl:w-[80%] w-full">
          <div className="grid grid-flow-row gap-7">
            {previewArticles.slice(0, visibleCount).map((art) => (
              <ArticlePreviewCard key={art.url_name} article={art} isMain />
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
