"use client";
import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
// eslint-disable-next-line boundaries/element-types
import { CommentList } from "@/features/exchanger/review";
import { CommentIcon, NegativeSmile, NeutralSmile, PositiveSmile } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { ExchangerMarker, ReviewEnum } from "@/shared/types";
import { ExchangerReview, getCommentsByReview } from "..";

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
        <div className="flex items-center justify-center gap-2">
          <p className="text-black  md:text-xs text-2xs font-normal uppercase">Положительный </p>
          <PositiveSmile className="md:size-6" />
        </div>
      );
    }
    if (review?.grade === ReviewEnum.neutral) {
      return (
        <div className="flex items-center justify-center gap-2">
          <p className="text-black md:text-xs text-2xs font-normal uppercase">Нейтральный</p>
          <NeutralSmile className="md:size-6" />
        </div>
      );
    }
    if (review?.grade === ReviewEnum.negative) {
      return (
        <div className="flex items-center justify-center gap-2">
          <p className="text-light-gray md:text-xs text-2xs font-normal uppercase">Отрицательный</p>
          <NegativeSmile className="md:size-6" />
        </div>
      );
    }
  };
  const onExpand = () => {
    setIsOpenReview((prev) => !prev);
  };
  return (
    <div className="relative z-0">
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] rounded-3xl p-7 grid grid-cols-1 gap-4  bg-dark-gray relative ">
        <div
          className={cx(
            "absolute right-[-1px] flex items-center justify-center top-[-1px]  md:w-1/3 w-1/2 md:h-12 h-7 border-r-0 border-t-0  rounded-tr-3xl  rounded-bl-[32px]",
            review?.grade === ReviewEnum.positive && "bg-yellow-main",
            review?.grade === ReviewEnum?.negative && "bg-dark-gray border border-light-gray",
            review?.grade === ReviewEnum?.neutral && "bg-light-gray",
          )}
        >
          {reviewRender()}
        </div>
        <div>
          <p className="font-normal md:text-sm text-xs uppercase">{review?.username}</p>
          <div className="flex gap-1 md:text-xs text-2xs">
            <p className="font-light">{review?.review_date}</p>
            <span className="font-light">/</span>
            <p className="font-light">{review?.review_time}</p>
          </div>
        </div>
        <div>
          <p
            ref={ref}
            className={cn(
              "md:text-sm text-xs font-light line-clamp-2",
              isOpenReview && "line-clamp-none",
            )}
          >
            {review?.text}
          </p>
          <button onClick={onExpand} className="text-yellow-main text-sm">
            {isShowExpandButton && (isOpenReview ? "СВЕРНУТЬ" : "РАЗВЕРНУТЬ")}
          </button>
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-2 md:gap-0 justify-between md:items-center items-start">
          <div className="w-full">{/* {replySlot} */}</div>
          <button
            disabled={review.comment_count < 1}
            className={cn(
              "text-sm flex items-center gap-2 text-yellow-main",
              review.comment_count < 1 && "text-light-gray opacity-50",
            )}
            onClick={onExpand}
          >
            <CommentIcon className="md:size-7 size-5" />
            {isOpenReview ? (
              <p className="text-2xs md:text-xs font-normal">СКРЫТЬ КОММЕНТАРИИ</p>
            ) : (
              <p className="text-2xs md:text-xs font-normal">
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
