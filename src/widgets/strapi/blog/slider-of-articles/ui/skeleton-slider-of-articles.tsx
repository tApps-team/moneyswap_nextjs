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
      <div className="grid gap-[30px] mobile-xl:rounded-[50px] mobile-xl:bg-dark-gray bg-transparent mobile-xl:p-6 p-0 mobile-xl:shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <Skeleton className="mx-auto flex justify-center items-center w-[30%] bg-skeleton-gray text-skeleton-gray uppercase text-xl font-semibold text-center">
          ...
        </Skeleton>
        <Carousel
          opts={{
            align: "start",
          }}
          className="mobile-xl:w-full mobile-xl:grid mobile-xl:bg-transparent bg-dark-gray mobile-xl:rounded-none rounded-[35px] mobile-xl:p-0 p-6 mobile-xl:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
        >
          <CarouselContent>
            {articles?.map((art, index) => (
              <CarouselItem
                key={index}
                className="mobile-xl:basis-1/3 grid mobile-xl:pl-4 mobile-xl:px-0 pl-4"
              >
                <ArticlePreviewCardSkeleton key={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="mobile-xl:block hidden" />
          <CarouselNext className="mobile-xl:block hidden" />
        </Carousel>
      </div>
    </section>
  );
};
