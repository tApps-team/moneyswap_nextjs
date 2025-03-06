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
      {/* <Carousel
        opts={{
          align: "start",
        }}
        className="mobile-xl:grid hidden md:w-[calc(100%_-_100px)] md:mx-auto"
      >
        <CarouselContent className="w-full">
          {categoriesWithAllTab?.map((cat, index) => (
            <CarouselItem key={index} className="xl:basis-1/6 md:basis-2/9 basis-3/11 grid pl-4">
              <CategoryCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="md:inline-flex hidden -left-10 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 md:w-6 md:h-6 w-4 h-4" />
        <CarouselNext className="md:inline-flex hidden -right-10 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 md:w-6 md:h-6 w-4 h-4" />
      </Carousel> */}
      <div className="flex flex-wrap gap-2 mobile-xl:justify-center justify-start items-center">
        {categoriesWithAllTab?.map((cat, index) => (
          <CategoryCardSkeleton
            key={index}
            isLong={index === 0 || index === 3 || index === 5 || index === 7}
          />
        ))}
      </div>
    </section>
  );
};
