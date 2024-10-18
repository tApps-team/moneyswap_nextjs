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
      <div className="grid gap-[30px] rounded-[50px] bg-[#2d2d2d] p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <Skeleton className="mx-auto flex justify-center items-center w-[30%] bg-[#9d9d9d] text-[#9d9d9d] uppercase text-xl font-semibold text-center">
          ...
        </Skeleton>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full grid"
        >
          <CarouselContent>
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="basis-1/3 grid">
                <ArticlePreviewCardSkeleton key={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
