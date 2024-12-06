"use client";

import { FC, useEffect, useRef, useState } from "react";
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
    <section>
      <div className="grid md:w-full w-auto lg:gap-[30px] gap-6 lg:rounded-[30px] md:rounded-[24px] md:bg-dark-gray bg-transparent md:p-6 p-0 md:shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
        <h3 className="flex justify-center items-center w-full uppercase lg:text-xl mobile:text-lg text-md font-semibold text-center">
          {title}
        </h3>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="md:w-full md:bg-transparent bg-dark-gray md:rounded-none rounded-[35px] md:p-0 p-6 md:shadow-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]"
        >
          <CarouselContent className="flex">
            {articles?.map((art, index) => (
              <CarouselItem key={index} className="lg:basis-1/3 md:basis-2/5 md:pl-4 w-full">
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
          <CarouselPrevious className="md:inline-flex hidden" />
          <CarouselNext className="md:inline-flex hidden" />
        </Carousel>
      </div>
    </section>
  );
};
