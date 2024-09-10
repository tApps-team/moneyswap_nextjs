"use client";
import { cx } from "class-variance-authority";
import { Smile } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { Review, ReviewEnum } from "@/shared/types";

type ExchangerReviewCardProps = {
  replySlot?: React.ReactNode;
  review?: ReviewEnum;
};
export const ExchangerReviewCard = (props: ExchangerReviewCardProps) => {
  const { replySlot, review } = props;
  const [isOpenReview, setIsOpenReview] = useState(false);
  const reviewRender = () => {
    if (review === ReviewEnum.positive) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-black text-sm font-semibold">ПОЛОЖИТЕЛЬНЫЙ </p>
          <Smile fill="#2d2d2d" width={28} height={28} />
        </div>
      );
    }
    if (review === ReviewEnum.neutral) {
      return (
        <div>
          <p className="text-black">НЕЙТРАЛЬНЫЙ</p>
          <Smile width={16} height={16} />
        </div>
      );
    }
    if (review === ReviewEnum.negative) {
      return (
        <div>
          <p className="text-[#bbbbbb]">ОТРИЦАТЕЛЬНЫЙ</p>
          <Smile width={16} height={16} />
        </div>
      );
    }
  };
  const onExpand = () => {
    setIsOpenReview((prev) => !prev);
  };
  return (
    <div className="border rounded-3xl p-7 grid grid-cols-1 gap-4  bg-[#2d2d2d] relative">
      <div
        className={cx(
          "absolute right-[-1px] flex items-center justify-center top-[-1px]  w-56 h-9 border-r-0 border-t-0  rounded-tr-3xl  rounded-bl-3xl",
          review === ReviewEnum.positive && "bg-[#f6ff5f]",
          review === ReviewEnum?.negative && "bg-transparent",
          review === ReviewEnum?.neutral && "bg-[#bbbbbb]",
        )}
      >
        {reviewRender()}
      </div>
      <div>
        <p className="font-semibold text-lg">ALEX ALEXANDROV</p>
        <div className="flex gap-1 text-sm">
          <p>23.04.24</p>
          <span>/</span>
          <p>19:02</p>
        </div>
      </div>
      <div>
        <p className={cn("line-clamp-2", isOpenReview && "line-clamp-none")}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, eligendi deserunt
          perferendis harum tempore dolor sint asperiores nostrum deleniti reiciendis hic incidunt
          debitis eius! Nisi molestiae voluptatibus numquam nostrum. Repudiandae.
        </p>
        <button onClick={onExpand} className="text-[#f6ff5f] text-sm">
          {isOpenReview ? "СВЕРНУТЬ" : "РАЗВЕРНУТЬ"}
        </button>
      </div>
      <div>{replySlot}</div>
    </div>
  );
};
