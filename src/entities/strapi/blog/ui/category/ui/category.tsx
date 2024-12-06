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
      className={`w-full text-center uppercase mobile:text-xs text-2xs mobile-xl:font-semibold font-medium mobile-xl:py-3 mobile-xl:px-8 mobile:py-3 mobile:px-6 py-2.5 px-5 rounded-full transition-all duration-300 md:border-0 border-2 border-[#ddd] ${selectedCategory ? "bg-yellow-main text-black border-yellow-main" : "hover:bg-dark-gray hover:border-[#ddd]"} ${tag && "bg-yellow-main text-black border-yellow-main"}`}
    >
      {category ? category?.name : tag}
    </Link>
  );
};
