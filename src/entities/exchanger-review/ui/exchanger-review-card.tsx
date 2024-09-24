"use client";
import { cx } from "class-variance-authority";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line boundaries/element-types
import { CommentList } from "@/features/exchanger/review";
import { cn } from "@/shared/lib";
import { ReviewEnum } from "@/shared/types";
import { ExchangerReview } from "..";

type ExchangerReviewCardProps = {
  replySlot?: React.ReactNode;
  review?: ExchangerReview;
  commentListSlot?: React.ReactNode;
};
//TODO рефактор, нельзя использовать фичу в сущности
const MAX_HEIGHT = 40;
export const ExchangerReviewCard = (props: ExchangerReviewCardProps) => {
  const { replySlot, review, commentListSlot } = props;
  const [isOpenReview, setIsOpenReview] = useState(false);
  const [isShowExpandButton, setIsShowExpandButton] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (ref.current) {
      ref.current.clientHeight > MAX_HEIGHT
        ? setIsShowExpandButton(true)
        : setIsShowExpandButton(false);
    }
  }, [ref.current?.clientHeight]);
  const reviewRender = () => {
    if (review?.grade === ReviewEnum.positive) {
      return (
        <div className="flex items-center justify-center ">
          <p className="text-black text-sm font-semibold">ПОЛОЖИТЕЛЬНЫЙ </p>
          <Smile fill="#2d2d2d" width={28} height={28} />
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
          <p className="text-[#bbbbbb] text-sm font-semibold">ОТРИЦАТЕЛЬНЫЙ</p>
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
      <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] rounded-3xl p-7 grid grid-cols-1 gap-4  bg-[#2d2d2d] relative ">
        <div
          className={cx(
            "absolute right-[-1px] flex items-center justify-center top-[-1px]  w-60 h-12 border-r-0 border-t-0  rounded-tr-3xl  rounded-bl-[32px]",
            review?.grade === ReviewEnum.positive && "bg-[#f6ff5f]",
            review?.grade === ReviewEnum?.negative && "bg-transparent border border-[#bbbbbb]",
            review?.grade === ReviewEnum?.neutral && "bg-[#bbbbbb]",
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
          <button onClick={onExpand} className="text-[#f6ff5f] text-sm">
            {isShowExpandButton && (isOpenReview ? "СВЕРНУТЬ" : "РАЗВЕРНУТЬ")}
          </button>
        </div>
      </div>
      {/* РЕФАКТОР */}
      <div>{commentListSlot}</div>
    </div>
  );
};
