import Link from "next/link";
import { FC } from "react";
import { Category, CategoryCard } from "@/entities/strapi";
import { routes } from "@/shared/router";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "@/shared/ui";

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
  return (
    <section className="grid grid-flow-col justify-between gap-2 items-center">
      <Link
        scroll={false}
        href={routes.blog}
        className={`uppercase truncate text-xs font-semibold py-3 px-8 rounded-[35px] border-2 border-transparent transition-all duration-300 ${!selectedCategory && !selectedTag ? "bg-[#f6ff5f] text-black border-[#f6ff5f]" : "hover:bg-[#2d2d2d] hover:border-[#ddd]"}`}
      >
        Все статьи
      </Link>
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

{
  /* <Carousel
opts={{
  align: "start",
}}
className="w-full"
>
<CarouselContent>
  <CarouselItem key={0} className="basis-[15%] grid">
    <Link
      scroll={false}
      href={routes.blog}
      className={`uppercase truncate text-xs font-medium py-3 px-8 rounded-[35px] border-2 border-[#bbbbbb] bg-[#2d2d2d] transition-all duration-300 ${!selectedCategory ? "bg-[#f6ff5f] text-black border-[#f6ff5f]" : "hover:bg-[#bbbbbb]  hover:text-black"}`}
    >
      Все статьи
    </Link>
  </CarouselItem>
  {categories?.map((cat, index) => (
    <CarouselItem key={index + 1} className="basis-[15%] grid">
      <CategoryCard
        key={cat?.id}
        category={cat}
        selectedCategory={cat?.category === selectedCategory}
      />
    </CarouselItem>
  ))}
</CarouselContent>
<CarouselNext />
</Carousel> */
}
