import Image from "next/image";
import searchAnimation from "/public/animated/search_spin.gif";
import { ReviewFilter } from "@/features/exchanger/review";
import { AddReview } from "@/features/exchanger/review/add-review";
import { ExchangerPagination } from "@/features/exchanger/review/pagintaion";
import { ExchangerReview, ExchangerReviewCard } from "@/entities/exchanger-review";
import { Review } from "@/shared/types";

type ExchangerReviewsProps = {
  reviews: ExchangerReview[];
  totalPages: number;
  reviewCount: Review;
  reviews_on_page: number;
  exchanger_id: number;
};
export const ExchangerReviews = async (props: ExchangerReviewsProps) => {
  const { reviews, totalPages, reviewCount, reviews_on_page, exchanger_id } = props;

  return (
    <section className="grid items-center md:gap-[50px] gap-[30px]">
      <div className="flex mobile-xl:flex-row flex-col gap-3 justify-between items-center">
        <p className="mobile-xl:block hidden unbounded_font mobile-xl:text-3xl md:font-semibold font-normal text-yellow-main">
          ОТЗЫВЫ
        </p>
        <AddReview href={`${process.env.NEXT_PUBLIC_TGBOT_BASE_URL}?start=review__${exchanger_id}`}/>
      </div>
      {totalPages > 0 && (
        <div className="lg:block hidden">
          {totalPages > 0 && <ExchangerPagination totalPages={totalPages} />}
        </div>
      )}
      <ReviewFilter reviewCount={reviewCount} />

      {reviews?.length > 0 ? (
        <>
          <div className="grid grid-flow-row mobile-xl:gap-5 gap-3">
            {reviews?.map((review) => (
              <ExchangerReviewCard key={review.id} review={review} exchanger_id={exchanger_id} />
            ))}
          </div>
          {totalPages > 0 && reviews.length === reviews_on_page && <ExchangerPagination totalPages={totalPages} />}
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center gap-10">
          <Image
            src={searchAnimation}
            alt="search spin"
            className="md:w-[7.5vw] md:h-[7.5vw] mobile-xl:w-[10vw] mobile-xl:h-[10vw] w-[30vw] h-[30vw]"
          />
          <p className="text-base font-normal text-font-light-grey text-center mobile:max-w-full max-w-[90%]">
            По данному фильтру не найдено отзывов
          </p>
        </div>
      )}
    </section>
  );
};
