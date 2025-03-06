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
      <div className="grid md:w-full w-auto lg:gap-[30px] gap-6 rounded-[15px] bg-new-dark-grey lg:p-10 mobile-xl:p-8 p-[10px] py-6">
        <Skeleton className="flex justify-center items-center uppercase lg:text-xl mobile:text-lg text-md font-bold text-center mx-auto bg-skeleton-gray text-skeleton-gray text-xl w-[30%]">
          ...
        </Skeleton>
        <Carousel
          opts={{
            align: "start",
          }}
          className=""
        >
          <CarouselContent className="flex">
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="lg:basis-1/3 md:basis-2/5 md:pl-4 w-full">
                <ArticlePreviewCardSkeleton key={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="md:inline-flex hidden -left-4 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 w-8 h-8 shadow-lg" />
          <CarouselNext className="md:inline-flex hidden -right-4 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 w-8 h-8 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
};
