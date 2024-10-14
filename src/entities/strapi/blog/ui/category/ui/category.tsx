import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { Category } from "../../../model";

interface CategoryCardProps {
  category: Category;
  selectedCategory: boolean;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, selectedCategory }) => {
  const path = category.category
    ? `${routes.blog}${routes.category}/${category?.category}`
    : routes.blog;
  return (
    <Link
      scroll={false}
      href={path}
      className={`w-full text-center uppercase text-xs font-semibold py-3 px-8 rounded-[35px] border-2 border-transparent transition-all duration-300 ${selectedCategory ? "bg-yellow-main text-black border-yellow-main" : "hover:bg-dark-gray hover:border-[#ddd]"}`}
    >
      {category?.name}
    </Link>
  );
};
