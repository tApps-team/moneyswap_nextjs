import { Loader } from "lucide-react";
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
      className={`group mobile-xl:mx-2 mx-0 mobile-xl:rounded-[30px] rounded-[24px] ${isMain && "bg-black"} relative`}
      href={`${routes.blog}${routes.article}/${article?.url_name}`}
      scroll={true}
    >
      <div className="mobile-xl:rounded-[30px] rounded-[24px] absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <Loader className="animate-spin h-20" />
      </div>
      <div>
        <div className="relative z-10 w-full max-w-full h-auto max-h-[174px] mobile-xl:border-[2px] border-[1px] border-[#000] mobile-xl:rounded-[30px] rounded-[24px] overflow-hidden">
          <Image
            className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
            src={article?.image}
            alt={article?.title}
            width={500}
            height={500}
          />
        </div>
        <div className={`uppercase grid grid-flow-row gap-1 py-4 ${isMain && "px-4"}`}>
          <p className="text-light-gray font-medium text-[9px]">{formattedDate}</p>
          <h3 className="text-2xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
            {article?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
