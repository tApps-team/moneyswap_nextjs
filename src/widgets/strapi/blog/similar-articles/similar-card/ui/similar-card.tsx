import Link from "next/link";
import { FC } from "react";
import { ArticlePreview } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface SimilarCardProps {
  article: ArticlePreview;
}

export const SimilarCard: FC<SimilarCardProps> = ({ article }) => {
  return (
    <Link
      className="rounded-[20px] transition-all duration-500 group mx-2"
      href={`${routes.blog}/${routes.article}/${article?.url_name}`}
    >
      <div className="w-full h-[10vw] max-h-[200px] rounded-[20px] border-[1px] border-[#ddd] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
          src={article?.image}
          alt={article?.title}
        />
      </div>
      <div className="uppercase grid grid-flow-row gap-0 pt-2">
        <p className="text-[#bbbbbb] font-medium text-[8px]">{article?.publishedAt}</p>
        <h3 className="text-[8px] font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
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
