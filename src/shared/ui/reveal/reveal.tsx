"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";
import { useInView } from "@/shared/lib/hooks/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Задержка появления в миллисекундах — для лесенки соседних блоков. */
  delay?: number;
  /** Якорь для ссылок вида «#sections». */
  id?: string;
}

/** Плавно показывает блок, когда он доходит до экрана. */
export const Reveal: FC<RevealProps> = ({ children, className, delay = 0, id }) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      id={id}
      ref={ref}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        "motion-reduce:animate-none motion-reduce:opacity-100",
        inView ? "animate-fade-in-up" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};
