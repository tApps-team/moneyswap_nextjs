import Link from "next/link";
import { FC } from "react";
import { Category } from "@/entities/blog/model";
import { routes } from "@/shared/router";

interface CategoryCardProps {
  category: Category;
  selectedCategory: boolean;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, selectedCategory }) => {
  return (
    <Link
      href={`${routes.blog}/${routes.category}/${category?.category}`}
      className={`uppercase text-xs font-medium py-3 px-8 rounded-[35px] border-2 border-[#bbbbbb] bg-[#2d2d2d] hover:bg-[#bbbbbb]  hover:text-black transition-all duration-300 ${selectedCategory && "bg-[#f6ff5f] text-black border-[#f6ff5f]"}`}
    >
      {category?.name}
    </Link>
  );
};
