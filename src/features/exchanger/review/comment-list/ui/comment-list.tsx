"use client";
import { useEffect, useRef, useState } from "react";
import { Comment, CommentCard } from "@/entities/exchanger-review";
import { cn } from "@/shared/lib";

type CommentListProps = {
  comments?: Comment[];
  isOpen: boolean;
};

export const CommentList = (props: CommentListProps) => {
  const { comments, isOpen } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<undefined | number | string>(isOpen ? "auto" : 0);

  useEffect(() => {
    if (isOpen) {
      setHeight(ref.current?.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="">
      <div
        ref={ref}
        style={{ height }}
        className={cn(
          "w-full relative -z-10 text-black duration-500 translate-y-[-55px] ease-in-out overflow-hidden rounded-b-[10px] bg-new-light-grey",
          isOpen && "-mb-[55px]"
        )}
      >
        <div className={cn("p-4 grid first:pt-[50px]")}>
          {comments
            ? comments?.map((comment) => <CommentCard key={comment?.id} comment={comment} />)
            : "Список пуст"}
        </div>
      </div>
    </div>
  );
};
