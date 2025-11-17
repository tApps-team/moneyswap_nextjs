"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { increaseDirectionCount } from "@/entities/direction";

type DirectionLinkProps = {
  href: string;
  className?: string;
  valuteFrom: string;
  valuteTo: string;
  city: string | null;
  children: ReactNode;
};

export const DirectionLink = ({ href, className, valuteFrom, valuteTo, city, children }: DirectionLinkProps) => {
  const handleClick = () => {
    if (valuteFrom && valuteTo) {
      const increaseDirectionCountReq = {
        valute_from: valuteFrom,
        valute_to: valuteTo,
        city_code_name: city ?? null,
      };
      increaseDirectionCount(increaseDirectionCountReq);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

