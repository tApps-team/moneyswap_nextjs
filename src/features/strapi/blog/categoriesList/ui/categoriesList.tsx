import { FC } from "react";
import { Category, CategoryCard } from "@/entities/strapi";

interface CategoriesListProps {
  categories: Category[];
  selectedCategory?: string;
  selectedTag?: string;
}

export const CategoriesList: FC<CategoriesListProps> = ({
  categories,
  selectedCategory,
  selectedTag,
}) => {
  const allTag = {
    id: 0,
    name: "Все статьи",
    category: null,
  };
  const categoriesWithAllTab = [allTag, ...categories];

  return (
      <div className="flex flex-wrap gap-2 mobile-xl:justify-center justify-start items-center">
        {selectedTag && <CategoryCard tag={selectedTag} />}
        {categoriesWithAllTab?.map((cat) => (
          <CategoryCard
            key={cat?.id}
            category={cat && cat}
            selectedCategory={
              cat?.category
                ? cat?.category === selectedCategory
                : !selectedCategory && !selectedTag && true
            }
          />
        ))}
      </div>
  );
};
