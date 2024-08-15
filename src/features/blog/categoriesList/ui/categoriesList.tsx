import { FC } from "react";
import { Category, CategoryCard } from "@/entities/blog";

interface CategoriesListProps {
  categories: Category[];
  selectedCategory?: string;
}

export const CategoriesList: FC<CategoriesListProps> = ({ categories, selectedCategory }) => {
  return (
    <section className="grid grid-flow-col justify-between gap-4 items-center">
      {categories?.map((cat) => (
        <CategoryCard
          key={cat?.id}
          category={cat}
          selectedCategory={cat?.category === selectedCategory}
        />
      ))}
    </section>
  );
};
