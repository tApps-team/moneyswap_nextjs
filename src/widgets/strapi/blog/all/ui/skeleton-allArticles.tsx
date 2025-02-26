"use client";

import { ArticlePreviewCardSkeleton } from "@/entities/strapi";

export const AllArticlesSkeleton = () => {
  const previewArticles = [1, 2, 3, 4];
  return (
    <section className="grid h-full w-full">
      <section className="grid grid-flow-row gap-8">
        <div className="grid grid-rows-[1fr_auto] gap-8 xl:p-8 lg:p-5 p-6 lg:rounded-[15px] rounded-[10px] bg-new-dark-grey">
          <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-8 gap-5">
            {previewArticles.map((art, index) => (
              <ArticlePreviewCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};
