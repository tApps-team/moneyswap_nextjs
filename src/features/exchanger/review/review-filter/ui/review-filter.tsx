"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib";
import { Review, ReviewEnum } from "@/shared/types";
import { filterData } from "../model/filter-data";

type ReviweFilterProps = { reviewCount: Review };
//TODO
export const ReviweFilter = (props: ReviweFilterProps) => {
  const { reviewCount } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentExchnagerMarker = searchParams.get("exchanger-marker");
  const currentGrade = searchParams.get("grade") || undefined;

  const createUrl = (grade: number | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (typeof grade === "undefined") {
      params.delete("grade");
    } else {
      params.set("grade", grade.toString());
    }

    return `${pathname}?${params.toString()}`;
  };
  const allReviewCount = reviewCount?.negative + reviewCount?.neutral + reviewCount?.positive;
  const currentReviewGradeCount = (data: ReviewEnum) => {
    if (data === ReviewEnum.all) return allReviewCount;
    if (data === ReviewEnum.negative) return reviewCount.negative;
    if (data === ReviewEnum.neutral) return reviewCount.neutral;
    if (data === ReviewEnum.positive) return reviewCount.positive;
  };
  return (
    <div className="grid grid-cols-4 gap-6">
      {filterData.map((data, index) => {
        return (
          <Link
            scroll={false}
            key={data.value}
            className={cn(
              "border hover:border-yellow-main hover:bg-yellow-main flex justify-center gap-1 hover:text-black  text-center rounded-full bg-dark-gray p-4 text-xs font-medium",
              (currentGrade === data.grade?.toString() ||
                (typeof currentGrade === "undefined" && typeof data.grade === "undefined")) &&
                "bg-yellow-main border-yellow-main text-black ",
            )}
            href={createUrl(data.grade)}
          >
            <p>{data.value}</p>
            <span>({currentReviewGradeCount(data.review)})</span>
          </Link>
        );
      })}
    </div>
  );
};
