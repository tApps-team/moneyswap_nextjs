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
}

export const ArticlePreviewCard: FC<ArticlePreviewCardProps> = ({ article }) => {
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
      className={`h-full w-full group xl:rounded-[20px] rounded-[15px] bg-new-grey relative`}
      href={`${routes.blog}${routes.article}/${article?.url_name}`}
      scroll={true}
    >
      <div className="p-[10px]">
        <div className="relative z-1 w-full max-w-full h-auto max-h-[calc(100vw_/_2.41)] lg:max-h-[189px] xl:rounded-[15px] rounded-[10px] overflow-hidden">
          {isLoading && (
            <Skeleton className="absolute inset-0 flex items-center justify-center bg-new-light-grey text-white">
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
        <div className={`uppercase grid grid-cols-1 gap-1 "px-4 py-4`}>
          <span className="text-font-light-grey inline font-medium max:text-xs mobile:text-2xs text-[9px]">
            {formattedDate}
          </span>
          <h3 className="max:text-sm text-[11px] font-medium leading-4 line-clamp-2">
            {article?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
