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
    <section className="bg-new-dark-grey rounded-[10px] lg:p-9 md:p-6 p-4 grid lg:gap-8 gap-4">
      <h3 className="w-full uppercase lg:text-2xl md:text-xl mobile-xl:text-base text-sm font-bold text-center text-yellow-main">
        {title}
      </h3>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="grid"
      >
        <CarouselContent>
          {articles?.map((art, index) => (
            <CarouselItem
              key={index}
              className="lg:basis-1/3 md:basis-2/4 mobile-xl:basis-2/4 pl-4"
            >
              <ArticlePreviewCard key={art?.url_name} article={art} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          ref={progressBarRef}
          className="mobile-xl:hidden block relative h-[3px] w-full bg-light-gray rounded-full mt-4"
        >
          <div
            className={`-top-[50%] translate-y-[50%] absolute h-[6px] bg-yellow-main rounded-full transition-transform duration-200`}
            style={{
              width: `${progressWidth / count}px`,
              transform: `translateX(${(progressWidth / count) * current}px)`,
            }}
          ></div>
        </div>
        <CarouselNext className="mobile-xl:inline-flex hidden -right-4 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 w-8 h-8 shadow-lg" />
      </Carousel>
    </section>
  );
};
