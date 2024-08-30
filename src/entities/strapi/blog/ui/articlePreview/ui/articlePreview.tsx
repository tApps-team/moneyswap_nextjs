import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { ArticlePreview } from "../../../model";

interface ArticlePreviewCardProps {
  article: ArticlePreview;
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article }) => {
  return (
    <Link
      className="rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] hover:shadow-[1px_3px_15px_3px_rgba(0,0,0,0.7)] transition-all duration-500 group"
      href={`${routes.blog}/${routes.article}/${article?.url_name}`}
    >
      <div className="w-full h-[15vw] max-h-[300px] rounded-t-[35px] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
          src={article?.image}
          alt={article?.title}
        />
      </div>
      <div className="uppercase grid grid-flow-row gap-2 p-4">
        <p className="text-[#bbbbbb] font-medium text-[10px]">{article?.publishedAt}</p>
        <h3 className="text-xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
          {article?.title}
        </h3>
        {/* <p
          className="text-[10px] font-light max-h-[200px] overflow-hidden line-clamp-4 strapi_styles"
          dangerouslySetInnerHTML={{ __html: article?.description }}
        /> */}
      </div>
    </Link>
  );
};
