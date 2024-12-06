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
        className="grid md:w-[calc(100%_-_100px)] md:mx-auto"
      >
        <CarouselContent className="w-full">
          {categoriesWithAllTab?.map((cat, index) => (
            <CarouselItem key={index} className="xl:basis-1/6 md:basis-2/9 basis-3/11 grid pl-4">
              <CategoryCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="md:inline-flex hidden -left-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-dark-gray hover:text-yellow-main hover:scale-110" />
        <CarouselNext className="md:inline-flex hidden -right-14 top-1/2 mt-0 -translate-y-1/2 border-0 hover:bg-dark-gray hover:text-yellow-main hover:scale-110" />
      </Carousel>
    </section>
  );
};
