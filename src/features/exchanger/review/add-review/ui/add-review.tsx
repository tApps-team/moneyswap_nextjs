"use client";

import Link from "next/link";
import { FC } from "react";
import { useYandexMetrika } from "@/shared/hooks";

type AddReviewProps = {
  href: string;
};

export const AddReview:FC<AddReviewProps> = ({href}) => {
  const { reviewAdd } = useYandexMetrika();
  return (
    <Link
      target="_blank"
      href={href}
      className="mobile-xl:text-sm text-xs mobile-xl:w-fit w-full uppercase leading-none rounded-[10px] font-semibold py-3.5 bg-yellow-main text-black px-9 text-center"
      onClick={reviewAdd}
    >
      Добавить отзыв об обменнике
    </Link>
  );
};
