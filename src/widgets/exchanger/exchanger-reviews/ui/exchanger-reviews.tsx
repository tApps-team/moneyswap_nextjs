import { Reply, ReviweFilter } from "@/features/exchanger/review";
import { AddReview } from "@/features/exchanger/review/add-review";
import { ExchangerPagination } from "@/features/exchanger/review/pagintaion";
import { ExchangerReview, ExchangerReviewCard } from "@/entities/exchanger-review";
import { ReviewEnum } from "@/shared/types";
import { Button, Pagination, PaginationContent, PaginationPrevious } from "@/shared/ui";
const mockReviews: ExchangerReview[] = [
  {
    comment_count: 0,
    grade: ReviewEnum.neutral,
    id: 0,
    review_date: "20.12.2002",
    review_time: "22:19",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, eligendi deserunt perferendis harum tempore dolor sint asperiores nostrum deleniti reiciendis hic inciduntdebitis eius! Nisi molestiae voluptatibus numquam nostrum. Repudiandae.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, eligendi deserunt perferendis harum tempore dolor sint asperiores nostrum deleniti reiciendis hic inciduntdebitis eius! Nisi molestiae voluptatibus numquam nostrum. Repudiandae.",
    username: "Dany",
  },
  {
    comment_count: 0,
    grade: ReviewEnum.positive,
    id: 1,
    review_date: "20.12.2002",
    review_time: "22:19",
    text: "Lorem ipsum dolor sit amet consectetur.",
    username: "Dany",
  },
  {
    comment_count: 0,
    grade: ReviewEnum.negative,
    id: 2,
    review_date: "20.12.2002",
    review_time: "22:19",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, eligendi deserunt perferendis harum tempore dolor sint asperiores nostrum deleniti reiciendis hic inciduntdebitis eius! Nisi molestiae voluptatibus numquam nostrum. Repudiandae.",
    username: "Dany",
  },
  {
    comment_count: 0,
    grade: ReviewEnum.negative,
    id: 3,
    review_date: "20.12.2002",
    review_time: "22:19",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, eligendi deserunt perferendis harum tempore dolor sint asperiores nostrum deleniti reiciendis hic inciduntdebitis eius! Nisi molestiae voluptatibus numquam nostrum. Repudiandae.",
    username: "Dany",
  },
];
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
      <ReviweFilter />
      {mockReviews.map((review) => (
        <ExchangerReviewCard key={review.id} review={review} replySlot={<Reply />} />
      ))}
    </section>
  );
};
