import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { Category } from "../../../model";

interface CategoryCardProps {
  category: Category;
  selectedCategory: boolean;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, selectedCategory }) => {
  return (
    <Link
      scroll={false}
      href={`${routes.blog}/${routes.category}/${category?.category}`}
      className={`uppercase truncate text-xs font-semibold py-3 px-8 rounded-[35px] border-2 border-transparent transition-all duration-300 ${selectedCategory ? "bg-[#f6ff5f] text-black border-[#f6ff5f]" : "hover:bg-[#2d2d2d] hover:border-[#ddd]"}`}
    >
      {category?.name}
    </Link>
  );
};
