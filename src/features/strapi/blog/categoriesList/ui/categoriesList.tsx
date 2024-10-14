// "use client";

import { FC, useEffect, useRef, useState } from "react";
import { Category, CategoryCard } from "@/entities/strapi";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

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
  // const carouselRef = useRef<HTMLDivElement>(null);
  // const [api, setApi] = useState<CarouselApi>();

  // const scrollToActiveCategory = async () => {
  //   if (categoriesWithAllTab.length > 0 && api && selectedCategory) {
  //     const index = categoriesWithAllTab.findIndex((cat) => cat.category === selectedCategory);
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     api.scrollTo(index);
  //   }
  // };

  // useEffect(() => {
  //   scrollToActiveCategory();
  // }, [api, selectedCategory, categoriesWithAllTab]);
  return (
    <section>
      <Carousel
        // ref={carouselRef}
        opts={{
          align: "start",
        }}
        className="grid w-[calc(100%_-_100px)] mx-auto"
        // setApi={setApi}
      >
        <CarouselContent className="w-full">
          {categoriesWithAllTab?.map((cat, index) => (
            <CarouselItem key={index} className="basis-1/6 grid">
              <CategoryCard
                key={cat?.id}
                category={cat && cat}
                selectedCategory={
                  cat?.category
                    ? cat?.category === selectedCategory
                    : !selectedCategory && !selectedTag && true
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-dark-gray hover:text-yellow-main hover:scale-110" />
        <CarouselNext className="-right-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-dark-gray hover:text-yellow-main hover:scale-110" />
      </Carousel>
    </section>
  );
};
