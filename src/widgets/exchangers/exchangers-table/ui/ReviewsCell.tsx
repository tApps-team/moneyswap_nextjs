"use client";

import Link from "next/link";
import { Exchanger } from "@/entities/exchanger";
import { useYandexMetrika } from "@/shared/hooks";
import { routes } from "@/shared/router";

interface ReviewsCellProps {
  exchanger: Exchanger;
}

export const ReviewsCell = ({ exchanger }: ReviewsCellProps) => {
  const { reviewsOpen } = useYandexMetrika();

  return (
    <div className="relative grid grid-flow-col gap-2 items-center justify-between justify-items-start">
      {exchanger.is_vip && (
        <div className="absolute xl:-top-6 -top-5 right-0">
          <div className="bg-yellow-main px-4 xl:py-1 py-0.5 rounded-[3px]">
            <span className="block text-center text-black uppercase xl:text-2xs text-[9px] font-bold leading-none truncate">
              Лучшее предложение!
            </span>
          </div>
        </div>
      )}
      <Link
        href={`${routes.exchangers}/exchanger-${exchanger?.exchange_id}`}
        className="w-fit xl:text-base text-sm flex gap-1 border-2 border-font-dark-grey rounded-[6px] cursor-pointer hover:border-yellow-main px-3 py-2"
        onClick={reviewsOpen}
      >
        <div className="text-yellow-main">{exchanger.review_count.positive}</div>
        <span>|</span>
        <div className="text-white">{exchanger.review_count.neutral}</div>
        <span>|</span>
        <div className="text-[#FF0000]">{exchanger.review_count.negative}</div>
      </Link>
    </div>
  );
};
