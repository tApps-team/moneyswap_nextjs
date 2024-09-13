"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Review } from "@/shared/types";
import { filterData } from "../model/filter-data";

type ReviweFilterProps = {
  reviewGrade?: Review;
};
//TODO
export const ReviweFilter = (props: ReviweFilterProps) => {
  const { reviewGrade } = props;
  const searchParams = useSearchParams();
  const createUrl = () => {
    const url = `crypto-exchangers/exchnager`;
  };
  return (
    <div className="grid grid-cols-4 gap-6">
      {filterData.map((data) => (
        <Link
          key={data.href}
          className="border hover:border-[#f6ff5f] hover:bg-[#f6ff5f] hover:text-black  text-center rounded-full bg-[#2d2d2d] p-4 text-xs font-medium"
          href={"/"}
        >
          <p>{data.value}</p>
        </Link>
      ))}
    </div>
  );
};
