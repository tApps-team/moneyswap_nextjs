import { FC } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/blog";

interface PopularArticlesProps {
  articles: ArticlePreview[];
}

export const PopularArticles: FC<PopularArticlesProps> = ({ articles }) => {
  return (
    <section className="p-8 grid grid-cols-2 gap-8 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d]">
      {articles?.map((art) => <ArticlePreviewCard key={art?.url_name} article={art} />)}
    </section>
  );
};
