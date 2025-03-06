"use client";

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
      {/* <Carousel
        ref={carouselRef}
        opts={{
          align: "start",
          dragFree: true,
          duration: 10,
        }}
        className="mobile-xl:grid hidden md:w-[calc(100%_-_60px)] md:mx-auto"
        setApi={setApi}
      >
        <CarouselContent className="w-full">
          {selectedTag && (
            <CarouselItem key={0} className="md:hidden md:basis-1/6 basis-3/11 grid md:pl-6 pl-4">
              <CategoryCard tag={selectedTag} />
            </CarouselItem>
          )}
          {categoriesWithAllTab?.map((cat, index) => (
            <CarouselItem
              key={selectedTag ? index + 1 : index}
              className="xl:basis-1/6 md:basis-2/9 basis-3/11 grid md:pl-6 pl-4"
            >
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
        <CarouselPrevious className="md:inline-flex hidden -left-10 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 md:w-6 md:h-6 w-4 h-4" />
        <CarouselNext className="md:inline-flex hidden -right-10 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 md:w-6 md:h-6 w-4 h-4" />
      </Carousel> */}
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
    </section>
  );
};
