import { FC } from "react";
import { ArticlePreview, ArticlePreviewCard } from "@/entities/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

interface ReadersChoiceProps {
  title: string;
  articles: ArticlePreview[];
}

export const ReadersChoice: FC<ReadersChoiceProps> = ({ title, articles }) => {
  return (
    <section className="rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d]">
      <h3 className="flex justify-center items-center h-16 w-full bg-[#f6ff5f] rounded-t-[35px] p-8 text-black uppercase text-lg font-semibold text-center">
        {title}
      </h3>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
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
    </section>
  );
};
