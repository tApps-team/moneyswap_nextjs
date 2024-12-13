"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { routes } from "@/shared/router";
import { Skeleton } from "@/shared/ui";
import { ArticlePreview } from "../../../model";

interface ArticlePreviewCardProps {
  article: ArticlePreview;
  isMain?: boolean;
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article, isMain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
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
      className={`w-full group xl:rounded-[30px] rounded-[24px] ${isMain ? "bg-black" : ""} relative`}
      href={`${routes.blog}${routes.article}/${article?.url_name}`}
      scroll={true}
    >
      <div>
        <div className="relative z-1 w-full max-w-full h-auto max-h-[calc(100vw_/_2.41)] lg:max-h-[189px] mobile-xl:border-[2px] border-[1px] border-[#000] xl:rounded-[30px] rounded-[24px] overflow-hidden">
          {isLoading && (
            <Skeleton className="absolute inset-0 flex items-center justify-center bg-dark-gray text-white">
              <Loader className="animate-spin h-20" />
            </Skeleton>
          )}
          <Image
            className={`w-full h-full object-cover group-hover:scale-[1.025] transition-all duration-500 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            src={article?.image}
            alt={article?.title}
            width={500}
            height={500}
            priority
            onLoad={handleImageLoad}
          />
        </div>
        <div
          className={`uppercase grid grid-cols-1 gap-1 ${isMain ? "px-4 py-4" : "pt-4 pb-4 md:pb-0"}`}
        >
          <span className="text-light-gray inline font-normal mobile:text-[9px] mobile-xs:text-[8px] text-[7px]">
            {formattedDate}
          </span>
          <h3 className="mobile-xs:text-2xs text-[9px] font-normal max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
            {article?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
