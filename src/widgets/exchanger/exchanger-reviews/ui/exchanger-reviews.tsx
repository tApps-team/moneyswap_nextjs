import { CommentList, Reply, ReviewFilter } from "@/features/exchanger/review";
import { AddReview } from "@/features/exchanger/review/add-review";
import { ExchangerPagination } from "@/features/exchanger/review/pagintaion";
import { ExchangerReview, ExchangerReviewCard } from "@/entities/exchanger-review";
import { Review, ReviewEnum } from "@/shared/types";

type ExchangerReviewsProps = {
  reviews: ExchangerReview[];
  totalPages: number;
  reviewCount: Review;
};
export const ExchangerReviews = async (props: ExchangerReviewsProps) => {
  const { reviews, totalPages, reviewCount } = props;

  return (
    <section className="grid items-center gap-6">
      <div className="flex mobile-xl:flex-row flex-col gap-3 justify-between items-center">
        <p className="font-normal mobile-xl:block hidden text-sm">ОТЗЫВЫ</p>
        <AddReview />
      </div>
      {totalPages > 0 && <ExchangerPagination totalPages={totalPages} />}
      <ReviewFilter reviewCount={reviewCount} />

      {reviews?.length > 0 ? (
        <>
          <>
            {reviews?.map((review) => (
              <ExchangerReviewCard key={review.id} review={review} replySlot={<Reply />} />
            ))}
          </>
          {totalPages > 0 && reviews.length > 5 && <ExchangerPagination totalPages={totalPages} />}
        </>
      ) : (
        <div className="uppercase  text-xs text-center border  p-4 rounded-3xl ">
          <p>по данному фильтру не найдено отзывов</p>
        </div>
      )}
    </section>
  );
};
