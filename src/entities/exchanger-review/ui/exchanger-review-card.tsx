"use client";
import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { Smile } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line boundaries/element-types
import { CommentList } from "@/features/exchanger/review";
import { CommentIcon } from "@/shared/assets/icons/comment-icon";
import { PositiveSmile } from "@/shared/assets/icons/positive-smile";
import { cn } from "@/shared/lib";
import { ExchangerMarker, ReviewEnum } from "@/shared/types";
import { Comment, ExchangerReview, getCommentsByReview } from "..";

type ExchangerReviewCardProps = {
  replySlot?: React.ReactNode;
  review: ExchangerReview;
  // commentListSlot?: React.ReactNode;
};
//TODO рефактор, нельзя использовать фичу в сущности
const MAX_HEIGHT = 40;
export const ExchangerReviewCard = (props: ExchangerReviewCardProps) => {
  const { replySlot, review } = props;
  const { exchanger } = useParams();
  const [isOpenReview, setIsOpenReview] = useState(false);
  const searchParams = useSearchParams();
  const exchangerMarker = searchParams.get("exchanger-marker") as ExchangerMarker;

  const { data } = useQuery({
    queryFn: () =>
      getCommentsByReview({
        exchangerId: +exchanger,
        exchangerMarker: exchangerMarker,
        reviewId: review.id,
      }),
    queryKey: ["comment", review.id, exchangerMarker],
    enabled: isOpenReview && review.comment_count > 0,
    retry: false,
    refetchOnMount: false,
  });

  const [isShowExpandButton, setIsShowExpandButton] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  const reviewRender = () => {
    if (review?.grade === ReviewEnum.positive) {
      return (
        <div className="flex items-center justify-center ">
          <p className="text-black text-sm font-semibold">ПОЛОЖИТЕЛЬНЫЙ </p>
          <PositiveSmile width={28} height={28} />
        </div>
      );
    }
    if (review?.grade === ReviewEnum.neutral) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-black text-sm font-semibold">НЕЙТРАЛЬНЫЙ</p>
          <Smile fill="#2d2d2d" width={28} height={28} />
        </div>
      );
    }
    if (review?.grade === ReviewEnum.negative) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-light-gray text-sm font-semibold">ОТРИЦАТЕЛЬНЫЙ</p>
          <Smile fill="#2d2d2d" width={28} height={28} />
        </div>
      );
    }
  };
  const onExpand = () => {
    setIsOpenReview((prev) => !prev);
  };
  return (
    <div className="relative z-0">
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] rounded-3xl p-7 grid grid-cols-1 gap-4  bg-dark-gray relative ">
        <div
          className={cx(
            "absolute right-[-1px] flex items-center justify-center top-[-1px]  w-60 h-12 border-r-0 border-t-0  rounded-tr-3xl  rounded-bl-[32px]",
            review?.grade === ReviewEnum.positive && "bg-yellow-main",
            review?.grade === ReviewEnum?.negative && "bg-transparent border border-light-gray",
            review?.grade === ReviewEnum?.neutral && "bg-light-gray",
          )}
        >
          {reviewRender()}
        </div>
        <div>
          <p className="font-semibold text-lg uppercase">{review?.username}</p>
          <div className="flex gap-1 text-sm">
            <p>{review?.review_date}</p>
            <span>/</span>
            <p>{review?.review_time}</p>
          </div>
        </div>
        <div>
          <p ref={ref} className={cn("line-clamp-2 ", isOpenReview && "line-clamp-none")}>
            {review?.text}
          </p>
          <button onClick={onExpand} className="text-yellow-main text-sm">
            {isShowExpandButton && (isOpenReview ? "СВЕРНУТЬ" : "РАЗВЕРНУТЬ")}
          </button>
        </div>
        <div className="flex justify-between items-center ">
          <div>{replySlot}</div>
          <button
            disabled={review.comment_count < 1}
            className={cn(
              "text-sm flex items-center gap-2  text-yellow-main",
              review.comment_count < 1 && "text-[bbbbbb] opacity-50",
            )}
            onClick={onExpand}
          >
            <CommentIcon width={28} height={28} />
            {isOpenReview ? (
              <p>СКРЫТЬ КОММЕНТАРИИ</p>
            ) : (
              <p>
                СМОТРЕТЬ КОММЕНТАРИИ <span>({review.comment_count})</span>
              </p>
            )}
          </button>
        </div>
      </div>
      <CommentList isOpen={isOpenReview} comments={data} />
      {/* РЕФАКТОР */}
    </div>
  );
};
