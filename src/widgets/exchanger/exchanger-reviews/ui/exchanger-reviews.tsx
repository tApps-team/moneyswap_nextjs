import { CommentList, Reply, ReviweFilter } from "@/features/exchanger/review";
import { AddReview } from "@/features/exchanger/review/add-review";
import { ExchangerPagination } from "@/features/exchanger/review/pagintaion";
import { ExchangerReview, ExchangerReviewCard } from "@/entities/exchanger-review";
import { ReviewEnum } from "@/shared/types";

type ExchangerReviewsProps = {
  reviews: ExchangerReview[];
  totalPages: number;
};
export const ExchangerReviews = async (props: ExchangerReviewsProps) => {
  const { reviews, totalPages } = props;

  return (
    <section className="grid items-center gap-4">
      <div className="flex px-6 justify-between items-center">
        <p className="font-semibold">ОТЗЫВЫ</p>
        {/* features add review  */}
        <AddReview />
      </div>
      <hr className="" />
      {/* // фича пагинации или тут останется также фильтры */}
      {totalPages > 0 && <ExchangerPagination totalPages={totalPages} />}
      <ReviweFilter />

      {reviews.length > 0 ? (
        <>
          {reviews?.map((review) => (
            <ExchangerReviewCard key={review.id} review={review} replySlot={<Reply />} />
          ))}
          {totalPages > 0 && reviews.length > 5 && <ExchangerPagination totalPages={totalPages} />}
        </>
      ) : (
        <div className="uppercase flex items-center justify-center border h-16 rounded-3xl ">
          <p>по данному фильтру не найдено отзывов</p>
        </div>
      )}
    </section>
  );
};
