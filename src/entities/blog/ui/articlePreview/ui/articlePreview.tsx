import Link from "next/link";
import { FC } from "react";
import { ArticlePreview } from "@/entities/blog/model";
import { routes } from "@/shared/router";

interface ArticlePreviewCardProps {
  article: ArticlePreview;
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article }) => {
  return (
    <Link
      className="rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] border-2 border-[rgba(0,0,0,0)] hover:border-[#f6ff5f] transition-all duration-300"
      href={`${routes.blog}/${routes.article}/${article?.url_name}`}
    >
      <div className="w-full h-[15vw] max-h-[400px] rounded-t-[35px] overflow-hidden">
        <img className="w-full h-full object-cover" src={article?.image} alt={article?.title} />
      </div>
      <div className="uppercase grid grid-flow-row gap-2 p-4">
        <p className="text-[#bbbbbb] font-medium text-xs">{article?.publishedAt}</p>
        <h3 className="text-sm font-medium max-h-[200px] overflow-hidden text-ellipsis leading-6">
          {article?.title}
        </h3>
        {/* <p
          className="text-xs max-h-[200px] overflow-hidden text-ellipsis"
          dangerouslySetInnerHTML={{ __html: article?.description }}
        /> */}
      </div>
    </Link>
  );
};
