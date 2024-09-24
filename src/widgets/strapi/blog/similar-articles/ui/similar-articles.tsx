import { FC } from "react";
import { ArticlePreview } from "@/entities/strapi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "@/shared/ui";
import { SimilarCard } from "../similar-card";

interface SimilarArticlesProps {
  title: string;
  articles: ArticlePreview[];
}

export const SimilarArticles: FC<SimilarArticlesProps> = ({ title, articles }) => {
  return (
    <section className="grid gap-8">
      <h3 className="w-full uppercase text-md font-medium text-center">{title}</h3>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full grid"
      >
        <CarouselContent>
          {articles?.map((art, index) => (
            <CarouselItem key={index} className="basis-1/3 grid">
              <SimilarCard key={art?.url_name} article={art} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </section>
  );
};
