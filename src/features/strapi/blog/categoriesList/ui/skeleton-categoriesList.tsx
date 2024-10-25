import { CategoryCardSkeleton } from "@/entities/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

export const CategoriesListSkeleton = () => {
  const categoriesWithAllTab = [1, 2, 3, 4, 5, 6, 7];
  return (
    <section>
      <Carousel
        opts={{
          align: "start",
        }}
        className="grid w-[calc(100%_-_100px)] mx-auto"
      >
        <CarouselContent className="w-full">
          {categoriesWithAllTab?.map((cat, index) => (
            <CarouselItem key={index} className="basis-1/6 grid">
              <CategoryCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-[#2d2d2d] hover:text-yellow-main hover:scale-110" />
        <CarouselNext className="-right-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-[#2d2d2d] hover:text-yellow-main hover:scale-110" />
      </Carousel>
    </section>
  );
};
