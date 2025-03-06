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
      <div className="grid md:w-full w-auto lg:gap-[30px] gap-6 rounded-[15px] bg-new-dark-grey lg:p-10 mobile-xl:p-8 p-[10px] py-6">
        <h3 className="text-yellow-main flex justify-center items-center w-full uppercase lg:text-xl mobile:text-lg text-md font-bold text-center">
          {title}
        </h3>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className=""
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
            className="md:hidden block relative h-[3px] w-full bg-light-gray rounded-full mt-4 mx-auto max-w-[90%]"
          >
            <div
              className={`-top-[50%] translate-y-[50%] absolute h-[6px] bg-yellow-main rounded-full transition-transform duration-200`}
              style={{
                width: `${progressWidth / count}px`,
                transform: `translateX(${(progressWidth / count) * current}px)`,
              }}
            ></div>
          </div>
          <CarouselPrevious className="md:inline-flex hidden -left-4 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 w-8 h-8 shadow-lg" />
          <CarouselNext className="md:inline-flex hidden -right-4 top-1/2 mt-0 -translate-y-1/2 rounded-[6px] bg-new-grey hover:bg-new-light-grey hover:text-yellow-main border-0 w-8 h-8 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
};
