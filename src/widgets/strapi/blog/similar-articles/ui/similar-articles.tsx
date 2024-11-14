"use client";

import { FC, useEffect, useState } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext } from "@/shared/ui";
import { SimilarCard } from "../similar-card";

interface SimilarArticlesProps {
  title: string;
  articles: ArticlePreview[];
}

export const SimilarArticles: FC<SimilarArticlesProps> = ({ title, articles }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <section className="grid mobile-xl:gap-8 gap-6">
      <h3 className="w-full uppercase text-md font-medium text-center mobile-xl:text-white text-yellow-main">
        {title}
      </h3>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="mobile-xl:w-full mobile-xl:grid mobile-xl:bg-transparent bg-dark-gray mobile-xl:rounded-none rounded-[50px] mobile-xl:p-0 p-6 mobile-xl:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
      >
        <CarouselContent>
          {articles?.map((art, index) => (
            <CarouselItem
              key={index}
              className="mobile-xl:basis-1/3 mobile-xl:pl-4 pl-4 -mr-4 mobile-xl:mr-0"
            >
              <ArticlePreviewCard key={art?.url_name} article={art} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mobile-xl:hidden block relative mt-1 h-0.5 w-full bg-light-gray rounded-full">
          <div
            className={`-top-[50%] translate-y-[50%] absolute h-1 bg-yellow-main rounded-full transition-transform duration-300 w-[calc(100%_/_${count})]`}
            style={{
              transform: `translateX(${current * 100}%)`,
            }}
          ></div>
        </div>
        <CarouselNext className="mobile-xl:inline-flex hidden" />
      </Carousel>
    </section>
  );
};
