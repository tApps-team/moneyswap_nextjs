import { FC } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

interface SliderOfArticlesProps {
  title: string;
  articles: ArticlePreview[];
}

export const SliderOfArticles: FC<SliderOfArticlesProps> = ({ title, articles }) => {
  return (
    <section className="">
      <div className="grid gap-[30px] mobile-xl:rounded-[50px] mobile-xl:bg-dark-gray bg-transparent mobile-xl:p-6 p-0 mobile-xl:shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <h3 className="flex justify-center items-center w-full uppercase mobile-xl:text-xl text-lg mobile-xl:font-semibold font-medium text-center">
          {title}
        </h3>
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
                <ArticlePreviewCard key={art?.url_name} article={art} />
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
