import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { ArticlePreview } from "../../../model";

interface ArticlePreviewCardProps {
  article: ArticlePreview;
  isMain?: boolean;
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article, isMain }) => {
  // Настраиваем формат даты
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Преобразуем дату
  const formattedDate = formatter.format(new Date(article?.publishedAt));
  return (
    <Link
      className={`group mx-2 rounded-[30px] ${isMain && "bg-black"}`}
      href={`${routes.blog}${routes.article}/${article?.url_name}`}
    >
      <div className="w-full max-w-full h-auto max-h-[174px] border-[2px] border-[#000] rounded-[30px] overflow-hidden">
        <Image
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
          src={article?.image}
          alt={article?.title}
          width={500}
          height={500}
        />
      </div>
      <div className={`uppercase grid grid-flow-row gap-1 py-4 ${isMain && "px-4"}`}>
        <p className="text-[#bbbbbb] font-medium text-[9px]">{formattedDate}</p>
        <h3 className="text-[10px] font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
          {article?.title}
        </h3>
      </div>
    </Link>
  );
};
