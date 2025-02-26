"use client";

import { ArticlePreviewCardSkeleton } from "@/entities/strapi";

export const MobileAllArticlesSkeleton = () => {
  const previewArticles = [1, 2, 3, 4];
  return (
    <section className="md:hidden mobile-xl:bg-new-dark-grey bg-transparent mobile-xl:rounded-[15px] mobile-xl:p-5 p-[0px] grid justify-items-center h-full w-full">
      <section className="grid grid-flow-row gap-5 w-full mobile-xl:pb-0 pb-2">
        <div className="grid grid-flow-row gap-7">
          {previewArticles.map((art, index) => (
            <ArticlePreviewCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </section>
  );
};
