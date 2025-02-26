import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { Category } from "../../../model";

interface CategoryCardProps {
  category?: Category;
  selectedCategory?: boolean;
  tag?: string;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, selectedCategory, tag }) => {
  const path =
    category && category?.category
      ? `${routes.blog}${routes.category}/${category?.category}`
      : routes.blog;
  return (
    <Link
      scroll={false}
      href={path}
      className={`leading-none mobile-xl:rounded-[10px] rounded-[7px] bg-new-grey mobile-xl:w-full w-fit text-center md:text-sm mobile:text-xs text-2xs font-normal mobile-xl:py-3 mobile-xl:px-8 p-3 transition-all duration-300 ${selectedCategory ? "bg-yellow-main text-black" : "hover:bg-new-light-grey"} ${tag && "bg-yellow-main text-black"}`}
    >
      {category ? category?.name : tag}
    </Link>
  );
};
