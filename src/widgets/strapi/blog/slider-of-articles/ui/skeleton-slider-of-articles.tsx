import { ArticlePreviewCardSkeleton } from "@/entities/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Skeleton,
} from "@/shared/ui";

export const SliderOfArticlesSkeleton = () => {
  const articles = [1, 2, 3, 4, 5];
  return (
    <section className="">
      <div className="grid md:w-full w-auto lg:gap-[30px] gap-6 lg:rounded-[30px] md:rounded-[24px] md:bg-dark-gray bg-transparent md:p-6 p-0 md:shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <Skeleton className="mx-auto flex justify-center items-center w-[30%] bg-skeleton-gray text-skeleton-gray uppercase text-xl font-semibold text-center">
          ...
        </Skeleton>
        <Carousel
          opts={{
            align: "start",
          }}
          className="md:w-full md:bg-transparent bg-dark-gray md:rounded-none rounded-[35px] md:p-0 p-6 md:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
        >
          <CarouselContent className="flex">
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="lg:basis-1/3 md:basis-2/5 md:pl-4 w-full">
                <ArticlePreviewCardSkeleton key={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="md:inline-flex hidden" />
          <CarouselNext className="md:inline-flex hidden" />
        </Carousel>
      </div>
    </section>
  );
};
