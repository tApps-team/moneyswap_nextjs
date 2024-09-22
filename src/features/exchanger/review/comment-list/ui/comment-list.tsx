"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";

type CommentListProps = {
  comments?: unknown[];
  isOpen: boolean;
};
//TODO вынести комментарий в отдельную сущность, полный рефактор
export const CommentList = (props: CommentListProps) => {
  const { comments, isOpen } = props;
  // const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <div
      ref={ref}
      style={{ height }}
      className={cn(
        " -translate-y-[50px] relative z-[-1] text-black  duration-500 ease-in-out overflow-hidden rounded-[25px] bg-[#f6ff5f]",
        height !== 0 && "-mb-[50px]",
      )}
    >
      <p>ОТВЕТ ОТ АДМИНИСТРАЦИИ</p>
      <p>MONEYSWAP</p>
      <div className="flex gap-1">
        <p>23.04.24</p>
        <span>/</span>
        <p>21:05</p>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, esse repellat. Eos ad sed
        ut illum praesentium perspiciatis autem quibusdam reiciendis odio sequi minima distinctio,
        magni nisi! Libero, distinctio officia.
      </p>
    </div>
  );
};
