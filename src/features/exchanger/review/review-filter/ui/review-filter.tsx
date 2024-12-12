"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib";
import { Review, ReviewEnum } from "@/shared/types";
import { filterData } from "../model/filter-data";

type ReviewFilterProps = { reviewCount: Review };

export const ReviewFilter = ({ reviewCount }: ReviewFilterProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentGrade = searchParams.get("grade");
  const allReviewCount = reviewCount.negative + reviewCount.neutral + reviewCount.positive;

  const getReviewCount = (review: ReviewEnum) => {
    switch (review) {
      case ReviewEnum.negative:
        return reviewCount.negative;
      case ReviewEnum.neutral:
        return reviewCount.neutral;
      case ReviewEnum.positive:
        return reviewCount.positive;
      default:
        return allReviewCount;
    }
  };

  const createUrl = (grade?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    grade === undefined ? params.delete("grade") : params.set("grade", grade.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-4 gap-6 lg:gap-3 xl:gap-6">
      {filterData.map((data) => {
        const isActive =
          currentGrade === data.grade?.toString() ||
          (currentGrade === null && data.grade === undefined);

        return (
          <Link
            key={data.value}
            scroll={false}
            href={createUrl(data.grade)}
            className={cn(
              "border  hover:border-yellow-main text-2xs hover:bg-yellow-main flex justify-center   gap-1 hover:text-black text-center  rounded-full bg-dark-gray md:p-4 p-3  font-medium",
              isActive && "bg-yellow-main border-yellow-main text-black",
            )}
          >
            <p className="">{data.value}</p>
            <span className="">({getReviewCount(data.review)})</span>
          </Link>
        );
      })}
    </div>
  );
};
