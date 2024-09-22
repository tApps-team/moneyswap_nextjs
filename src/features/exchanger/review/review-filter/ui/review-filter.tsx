"use client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Grade } from "@/entities/exchanger-review";
import { cn } from "@/shared/lib";
import { Review } from "@/shared/types";
import { filterData } from "../model/filter-data";

type ReviweFilterProps = {};
//TODO
export const ReviweFilter = (props: ReviweFilterProps) => {
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

  return (
    <div className="grid grid-cols-4 gap-6">
      {filterData.map((data) => {
        return (
          <Link
            scroll={false}
            key={data.href}
            className={cn(
              "border hover:border-[#f6ff5f] hover:bg-[#f6ff5f] hover:text-black  text-center rounded-full bg-[#2d2d2d] p-4 text-xs font-medium",
              (currentGrade === data.grade?.toString() ||
                (typeof currentGrade === "undefined" && typeof data.grade === "undefined")) &&
                "bg-[#f6ff5f] border-[#f6ff5f] text-black ",
            )}
            href={createUrl(data.grade)}
          >
            <p>{data.value}</p>
          </Link>
        );
      })}
    </div>
  );
};
