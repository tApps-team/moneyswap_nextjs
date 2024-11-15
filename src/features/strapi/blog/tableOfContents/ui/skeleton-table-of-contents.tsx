"use client";

import { Dot } from "lucide-react";
import { Skeleton } from "@/shared/ui";

export const TableOfContentsBlockSkeleton = () => {
  const table_of_contents = [1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="grid grid-flow-row gap-3 max-h-[35svh] rounded-[20px] bg-black py-4 px-3">
      <div className="px-3">
        <h3 className="uppercase text-white font-semibold text-sm truncate">Оглавление</h3>
      </div>
      <div className="grid grid-flow-row gap-2 px-3 overflow-y-auto max-h-[35svh]">
        {table_of_contents?.map((item, index) => {
          const randomWidth = `${Math.floor(Math.random() * 61) + 40}%`;
          return (
            <Skeleton
              key={index}
              className={`bg-[#707070] text-skeleton-gray relative grid grid-flow-col gap-2 justify-start items-center uppercase text-xs font-medium`}
              style={{ width: randomWidth }}
            >
              <span
                className={`absolute left-[10px] w-[1px] bg-[#ddd] ${
                  index === 0
                    ? "top-[50%] bottom-0"
                    : index === table_of_contents?.length - 1
                      ? "top-0 bottom-[50%]"
                      : "-top-2 -bottom-2"
                }`}
              ></span>
              <Dot width={20} height={20} stroke={"#ddd"} className="scale-[1.7]" />
            </Skeleton>
          );
        })}
      </div>
    </section>
  );
};
