import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { ArticlePreview } from "../../../model";

interface ArticlePreviewCardProps {
  article: ArticlePreview;
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article }) => {
  return (
    <Link className="group mx-2" href={`${routes.blog}/${routes.article}/${article?.url_name}`}>
      <div className="w-full h-[15vw] max-h-[300px] border-[1px] border-[#ddd] rounded-[35px] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
          src={article?.image}
          alt={article?.title}
        />
      </div>
      <div className="uppercase grid grid-flow-row gap-1 pt-2">
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
