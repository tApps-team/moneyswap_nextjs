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
      <div className="grid gap-[30px] rounded-[50px] bg-[#2d2d2d] p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <h3 className="flex justify-center items-center w-full uppercase text-xl font-semibold text-center">
          {title}
        </h3>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full grid"
        >
          <CarouselContent>
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="basis-1/3 grid">
                <ArticlePreviewCard key={art?.url_name} article={art} />
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
