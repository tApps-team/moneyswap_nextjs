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
        <div className="relative z-1 w-full max-w-full h-auto max-h-[calc(100vw_/_2.41)] mobile-xl:max-h-[189px] mobile-xl:border-[2px] border-[1px] border-[#000] mobile-xl:rounded-[30px] rounded-[24px] overflow-hidden">
          <Image
            className="w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500"
            src={article?.image}
            alt={article?.title}
            width={500}
            height={500}
            priority
          />
        </div>
        <div className={`uppercase grid grid-cols-1 gap-1 py-4 ${isMain && "px-4"}`}>
          <span className="text-light-gray inline font-medium mobile:text-[9px] mobile-xs:text-[8px] text-[7px]">
            {formattedDate}
          </span>
          <h3 className="mobile-xs:text-2xs text-[9px] font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
            {article?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
