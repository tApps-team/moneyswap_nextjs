import Link from "next/link";
import { FC } from "react";
import { Button } from "@/shared/ui";

type AddReviewProps = {
  href: string;
};

export const AddReview:FC<AddReviewProps> = ({href}) => {
  return (
    <Link
      target="_blank"
      href={href}
      className="mobile-xl:text-sm text-xs mobile-xl:w-fit w-full uppercase leading-none rounded-[10px] font-semibold py-3.5 bg-yellow-main text-black px-9 text-center"
    >
      Добавить отзыв об обменнике
    </Link>
  );
};
