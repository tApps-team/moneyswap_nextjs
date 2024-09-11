"use client";
import { cx } from "class-variance-authority";
import { Smile } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { Review, ReviewEnum } from "@/shared/types";
import { ExchangerReview } from "..";

type ExchangerReviewCardProps = {
  replySlot?: React.ReactNode;
  review?: ExchangerReview;
};
export const ExchangerReviewCard = (props: ExchangerReviewCardProps) => {
  const { replySlot, review } = props;
  const [isOpenReview, setIsOpenReview] = useState(false);
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
    <div className="border border-[#bbbbbb] rounded-3xl p-7 grid grid-cols-1 gap-4  bg-[#2d2d2d] relative">
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
        <p className={cn("line-clamp-2", isOpenReview && "line-clamp-none")}>{review?.text}</p>
        <button onClick={onExpand} className="text-[#f6ff5f] text-sm">
          {isOpenReview ? "СВЕРНУТЬ" : "РАЗВЕРНУТЬ"}
        </button>
      </div>
      <div>{replySlot}</div>
    </div>
  );
};
