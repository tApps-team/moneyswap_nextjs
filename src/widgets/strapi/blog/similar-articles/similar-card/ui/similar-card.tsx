import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ArticlePreview } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface SimilarCardProps {
  article: ArticlePreview;
}

export const SimilarCard: FC<SimilarCardProps> = ({ article }) => {
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
      className="rounded-[20px] transition-all duration-500 group mx-2"
      href={`${routes.blog}/${routes.article}/${article?.url_name}`}
    >
      <div className="w-full max-w-full h-auto max-h-[122px] rounded-[20px] border-[1.5px] border-[#000] overflow-hidden">
        <Image
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
          src={article?.image}
          alt={article?.title}
          width={500}
          height={500}
        />
      </div>
      <div className="uppercase grid grid-flow-row gap-1 pt-2">
        <p className="text-light-gray font-medium text-[7px]">{formattedDate}</p>
        <h3 className="text-3xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-2 line-clamp-2">
          {article?.title}
        </h3>
      </div>
    </Link>
  );
};
