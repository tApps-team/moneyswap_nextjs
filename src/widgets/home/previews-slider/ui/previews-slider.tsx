"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { RatingPreview, RatingPreviewCard } from "@/features/rating-preview";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

interface PreviewsSliderProps {
  previews: RatingPreview[];
  /** Ссылка на полный рейтинг раздела — последним слайдом и в шапке блока. */
  href: string;
  allLabel?: string;
  /**
   * Догружаемые показатели по id превью: серверные ноды в Suspense, которые
   * приезжают отдельно от карточек. Слайдер их только раскладывает.
   */
  slots?: Record<string, ReactNode>;
}

/**
 * Горизонтальная подборка карточек.
 * На мобильных стрелки скрыты (hover там не работает), поэтому позицию
 * показывает прогресс-бар — приём из слайдера статей блога.
 */
export const PreviewsSlider: FC<PreviewsSliderProps> = ({
  previews,
  href,
  allLabel = "Смотреть весь рейтинг",
  slots,
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    const updateProgressWidth = () => {
      if (progressBarRef.current) setProgressWidth(progressBarRef.current.offsetWidth);
    };

    updateProgressWidth();
    window.addEventListener("resize", updateProgressWidth);
    return () => window.removeEventListener("resize", updateProgressWidth);
  }, []);

  if (!previews.length) return null;

  return (
    // Отступы внутри трека — чтобы overflow-hidden карусели не срезал бейдж
    // «Лучшее предложение» и подъём карточки на наведении; снаружи они
    // компенсированы отрицательными полями, поэтому ритм блока не меняется
    <div className="group/slider relative min-w-0 -mt-4 -mb-3">
      <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="flex -ml-3 mobile-xl:-ml-4 pt-4 pb-3">
          {previews.map((preview, index) => (
            <CarouselItem
              key={preview.id}
              className="pl-3 mobile-xl:pl-4 basis-[85%] mobile-xl:basis-1/2 md:basis-1/3 xl:basis-1/4"
            >
              <RatingPreviewCard preview={preview} index={index} slot={slots?.[preview.id]} />
            </CarouselItem>
          ))}

          <CarouselItem className="pl-3 mobile-xl:pl-4 basis-[85%] mobile-xl:basis-1/2 md:basis-1/3 xl:basis-1/4">
            <Link
              href={href}
              className="group grid h-full w-full min-w-0 place-content-center justify-items-center gap-3 rounded-[20px] border border-dashed border-new-grey/80 bg-new-dark-grey/40 p-5 text-center transition-[border-color,transform] duration-300 hover:border-yellow-main/70 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span className="grid place-items-center size-11 rounded-full bg-new-grey text-yellow-main transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="size-5" />
              </span>
              <span className="text-sm font-medium text-white transition-colors group-hover:text-yellow-main">
                {allLabel}
              </span>
            </Link>
          </CarouselItem>
        </CarouselContent>

        {/* Полоса прокрутки вместо стрелок там, где нет наведения */}
        <div
          ref={progressBarRef}
          className="md:hidden relative mx-auto mt-4 h-[3px] w-full max-w-[90%] rounded-full bg-new-grey"
        >
          <div
            className="absolute -top-[50%] h-[6px] translate-y-[50%] rounded-full bg-yellow-main transition-transform duration-200"
            style={{
              width: count ? `${progressWidth / count}px` : 0,
              transform: count ? `translateX(${(progressWidth / count) * current}px)` : undefined,
            }}
          />
        </div>

        {/*
          Стрелки лежат поверх крайних карточек: контейнер страницы даёт слева
          и справа всего 25px, вынести их наружу — значит поймать
          горизонтальный скролл на ширинах около 1024–1400.
          Когда листать некуда, кнопка скрывается, а не висит бледной.
        */}
        <CarouselPrevious className="hidden md:inline-flex left-1 top-1/2 mt-0 h-9 w-9 lg:h-10 lg:w-10 -translate-y-1/2 rounded-full border border-new-grey bg-new-dark-grey/90 text-white shadow-lg backdrop-blur-sm transition-[opacity,background-color,color] duration-200 hover:border-yellow-main hover:bg-yellow-main hover:text-black disabled:pointer-events-none disabled:opacity-0" />
        <CarouselNext className="hidden md:inline-flex right-1 top-1/2 mt-0 h-9 w-9 lg:h-10 lg:w-10 -translate-y-1/2 rounded-full border border-new-grey bg-new-dark-grey/90 text-white shadow-lg backdrop-blur-sm transition-[opacity,background-color,color] duration-200 hover:border-yellow-main hover:bg-yellow-main hover:text-black disabled:pointer-events-none disabled:opacity-0" />
      </Carousel>
    </div>
  );
};
