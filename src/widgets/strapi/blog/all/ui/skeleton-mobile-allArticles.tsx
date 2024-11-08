"use client";

import { ArticlePreviewCardSkeleton } from "@/entities/strapi";

export const MobileAllArticlesSkeleton = () => {
  const previewArticles = [1, 2, 3, 4];
  return (
    <section className="grid h-full w-full mobile-xl:hidden">
      <section className="grid grid-flow-row gap-7">
        <div className="grid grid-flow-row gap-7">
          {previewArticles.map((art, index) => (
            <ArticlePreviewCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </section>
  );
};
