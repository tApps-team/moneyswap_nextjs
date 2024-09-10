import { Reply } from "@/features/exchanger/review";
import { AddReview } from "@/features/exchanger/review/add-review";
import { ExchangerPagination } from "@/features/exchanger/review/pagintaion";
import { ExchangerReviewCard } from "@/entities/exchanger-review";
import { ReviewEnum } from "@/shared/types";
import { Button, Pagination, PaginationContent, PaginationPrevious } from "@/shared/ui";

export const ExchangerReviews = () => {
  return (
    <section className="grid items-center gap-4">
      <div className="flex px-6 justify-between items-center">
        <p className="font-semibold">ОТЗЫВЫ</p>
        {/* features add review  */}
        <AddReview />
      </div>
      <hr className="" />
      {/* // фича пагинации или тут останется также фильтры */}
      <ExchangerPagination />

      <ExchangerReviewCard replySlot={<Reply />} review={ReviewEnum.positive} />
      <ExchangerReviewCard replySlot={<Reply />} review={ReviewEnum.positive} />
      <ExchangerReviewCard replySlot={<Reply />} review={ReviewEnum.positive} />
    </section>
  );
};
