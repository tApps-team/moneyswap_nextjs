"use client";

import { FC, useEffect, useState } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import {
  Carousel,
  CarouselApi,
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
    <section className="">
      <div className="grid gap-[30px] mobile-xl:rounded-[50px] mobile-xl:bg-dark-gray bg-transparent mobile-xl:p-6 p-0 mobile-xl:shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <h3 className="flex justify-center items-center w-full uppercase mobile-xl:text-xl mobile:text-lg text-xs mobile-xl:font-semibold font-medium text-center">
          {title}
        </h3>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="mobile-xl:w-full mobile-xl:grid mobile-xl:bg-transparent bg-dark-gray mobile-xl:rounded-none rounded-[35px] mobile-xl:p-0 p-6 mobile-xl:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
        >
          <CarouselContent>
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="mobile-xl:basis-1/3 mobile-xl:pl-4 w-full">
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
          <CarouselPrevious className="mobile-xl:inline-flex hidden" />
          <CarouselNext className="mobile-xl:inline-flex hidden" />
        </Carousel>
      </div>
    </section>
  );
};
