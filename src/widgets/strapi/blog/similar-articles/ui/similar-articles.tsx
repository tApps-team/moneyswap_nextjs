"use client";

import { FC, useEffect, useRef, useState } from "react";
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
  const [progressWidth, setProgressWidth] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const updateProgressWidth = () => {
      if (progressBarRef.current) {
        setProgressWidth(progressBarRef.current.offsetWidth);
      }
    };

    updateProgressWidth();
    window.addEventListener("resize", updateProgressWidth);

    return () => {
      window.removeEventListener("resize", updateProgressWidth);
    };
  }, []);
  return (
    <section className="grid md:gap-8 gap-6">
      <h3 className="w-full uppercase text-md font-medium text-center md:text-white text-yellow-main">
        {title}
      </h3>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="md:w-full md:grid md:bg-transparent bg-dark-gray md:rounded-none rounded-[35px] md:p-0 p-6 md:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
      >
        <CarouselContent>
          {articles?.map((art, index) => (
            <CarouselItem
              key={index}
              className="lg:basis-1/3 mobile-xl:basis-7/12 md:pl-4 pl-4 -mr-4 md:mr-0"
            >
              <ArticlePreviewCard key={art?.url_name} article={art} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          ref={progressBarRef}
          className="md:hidden block relative h-[3px] w-full bg-light-gray rounded-full"
        >
          <div
            className={`-top-[50%] translate-y-[50%] absolute h-[6px] bg-yellow-main rounded-full transition-transform duration-200`}
            style={{
              width: `${progressWidth / count}px`,
              transform: `translateX(${(progressWidth / count) * current}px)`,
            }}
          ></div>
        </div>
        <CarouselNext className="md:inline-flex hidden" />
      </Carousel>
    </section>
  );
};
