import { FC } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "@/shared/ui";

interface SliderOfArticlesProps {
  title: string;
  articles: ArticlePreview[];
}

export const SliderOfArticles: FC<SliderOfArticlesProps> = ({ title, articles }) => {
  return (
    <section className="grid gap-[40px]">
      <h3 className="flex justify-center items-center w-full uppercase text-lg font-semibold text-center">
        {title}
      </h3>
      <div className="rounded-[35px] bg-[#2d2d2d] p-8 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
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
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
