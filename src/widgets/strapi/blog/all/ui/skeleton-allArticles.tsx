"use client";

import { ArticlePreviewCardSkeleton } from "@/entities/strapi";

export const AllArticlesSkeleton = () => {
  const previewArticles = [1, 2, 3, 4];
  return (
    <section className="grid h-full w-full">
      <section className="grid grid-flow-row gap-8">
        <div className="p-8 rounded-[50px] shadow-[1px_2px_10px_3px_rgba(0,0,0,0.5)] bg-[#2d2d2d]">
          <div className="grid grid-cols-2 gap-8">
            {previewArticles.map((art, index) => (
              <ArticlePreviewCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};
