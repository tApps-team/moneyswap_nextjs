"use client";
import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { Loader } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line boundaries/element-types
import { CommentList } from "@/features/exchanger/review";
import { CommentIcon, NegativeSmile, NeutralSmile, PositiveSmile } from "@/shared/assets";
import { cn } from "@/shared/lib";
import { ExchangerMarker, ReviewEnum } from "@/shared/types";
import { ExchangerReview, getCommentsByReview, ReviewFrom } from "..";

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

  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
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
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    // Проверяем при монтировании
    checkOverflow();
    
    // Проверяем при ресайзе окна
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [review?.text]);

  const reviewRender = () => {
    if (review?.grade === ReviewEnum.positive) {
      return (
        <div className="flex items-center justify-center gap-2">
          <PositiveSmile className="mobile-xl:size-5 size-2.5" />
          <p className="text-black  mobile-xl:text-sm mobile:text-xs text-2xs font-bold uppercase leading-none">
            Положительный{" "}
          </p>
        </div>
      );
    }
    if (review?.grade === ReviewEnum.neutral) {
      return (
        <div className="flex items-center justify-center gap-2">
          <NeutralSmile className="mobile-xl:size-5 size-2.5" />
          <p className="text-black mobile-xl:text-sm mobile:text-xs text-2xs font-bold uppercase leading-none">
            Нейтральный
          </p>
        </div>
      );
    }
    if (review?.grade === ReviewEnum.negative) {
      return (
        <div className="flex items-center justify-center gap-2">
          <NegativeSmile className="mobile-xl:size-5 size-2.5 stroke-font-light-grey" />
          <p className="text-font-light-grey mobile-xl:text-sm mobile:text-xs text-2xs font-bold uppercase leading-none">
            Негативный
          </p>
        </div>
      );
    }
  };
  const onExpand = () => {
    setIsShowExpandButton((prev) => !prev);
  };
  const onOpenReview = () => {
    setIsOpenReview((prev) => !prev);
  };

  return (
    <div className={`relative z-0`}>
      <div className="rounded-[10px] mobile-xl:py-7 mobile-xl:px-6 py-4 px-4 grid grid-cols-1 gap-4  bg-new-dark-grey relative ">
        <div
          className={cx(
            "absolute right-0 flex items-center justify-center top-0  mobile-xl:w-1/3 w-fit mobile-xl:py-[11px] mobile-xl:px-6 py-2 px-3 border-r-0 border-t-0 rounded-tr-[10px] rounded-bl-[10px]",
            review?.grade === ReviewEnum.positive && "bg-yellow-main",
            review?.grade === ReviewEnum?.negative && "bg-new-grey border border-new-grey",
            review?.grade === ReviewEnum?.neutral && "bg-font-light-grey",
          )}
        >
          {reviewRender()}
        </div>
        <div>
          <p className="font-bold mobile-xl:text-base mobile:text-sm text-xs uppercase max-w-[50%] truncate">
            {review?.username}
          </p>
          <div className="grid grid-flow-col gap-2 justify-between justify-items-stretch text-yellow-main mobile-xl:text-base mobile:text-sm text-xs md:font-bold font-medium">
            <div className="flex gap-1">
              <p className="">{review?.review_date}</p>
              <span className="">/</span>
              <p className="">{review?.review_time}</p>
            </div>
            {review?.review_from === ReviewFrom.bestchange && (
              <p className="truncate">отзыв с BestChange</p>
            )}
          </div>
        </div>
        <div className="grid gap-1">
          <div className="grid grid-flow-col gap-[10px] justify-start">
            <div className="h-full w-[1.5px] rounded-[5px] bg-font-dark-grey"></div>
            <p
              ref={textRef}
              className={cn(
                "mobile-xl:text-base mobile:text-sm text-xs font-medium",
                !isShowExpandButton && "line-clamp-2",
                "overflow-hidden"
              )}
            >
              {review?.text}
            </p>
          </div>
          {isOverflowing && (
            <button
              onClick={onExpand}
              className="unbounded_font text-end font-medium text-yellow-main mobile-xl:text-sm text-xs uppercase"
            >
              {isShowExpandButton ? "Свернуть" : "Развернуть"}
            </button>
          )}
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-2 md:gap-0 justify-between items-end">
          <button
            disabled={review.comment_count < 1}
            className={cn(
              "text-sm flex items-center gap-2 text-nowrap text-yellow-main",
              review.comment_count < 1 && "text-font-dark-grey opacity-50",
            )}
            onClick={onOpenReview}
          >
            {(isLoading || isFetching) && !isSuccess ? (
              <div className="flex justify-center items-center mb-2 size-5">
                <Loader color="#F6FF5F" className="animate-spin" />
              </div>
            ) : (
              <>
                <CommentIcon
                  className={`md:size-6 size-4 ${
                    review?.comment_count < 1 ? "fill-font-light-grey opacity-30" : "fill-yellow-main"
                  }`}
                />
                {isOpenReview ? (
                  <p className="mobile-xl:text-sm text-xs font-medium uppercase">
                    скрыть <span>({review?.comment_count})</span>
                  </p>
                ) : (
                  <p className="mobile-xl:text-sm text-xs font-medium uppercase">
                    смотреть комментарии <span>({review?.comment_count})</span>
                  </p>
                )}
              </>
            )}
          </button>
        </div>
      </div>
      {isSuccess && <CommentList isOpen={isOpenReview} comments={data} />}
      {/* РЕФАКТОР */}
    </div>
  );
};
