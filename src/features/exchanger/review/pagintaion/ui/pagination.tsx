"use client";
import { cx } from "class-variance-authority";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui";

type ExchangerPaginationProps = {
  totalPages: number;
};
// Todo  handle if total page = 0
export const ExchangerPagination = (props: ExchangerPaginationProps) => {
  const { totalPages } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const createPrevPage = () => {
    const params = new URLSearchParams(searchParams);
    if (currentPage > 1) {
      params.set("page", (currentPage - 1).toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const createNextPage = () => {
    const params = new URLSearchParams(searchParams);
    if (currentPage < totalPages) {
      params.set("page", (currentPage + 1).toString());
    }
    return `${pathname}?${params.toString()}`;
  };
  const [paginationArray, setPaginationArray] = useState<(number | string)[]>([]);

  useEffect(() => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Если страниц меньше или равно 7, показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Если страниц больше 7, добавляем логику с многоточиями
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    setPaginationArray(pages);
  }, [currentPage, totalPages]);
  return (
    <Pagination className="flex  gap-6 items-center">
      {/* <PaginationPrevious
        className={cn(
          "hover:bg-transparent border border-[#6B6E76] rounded-[6px] hover:text-white size-10 p-0",
        )}
        scroll={false}
        href={createPrevPage()}
      /> */}
      <PaginationContent className="rounded-full">
        {paginationArray.map((paginationItem) => (
          <PaginationItem key={paginationItem}>
            <PaginationLink
              className={cx(
                "rounded-[5px] font-semibold transition-all  hover:text-white  hover:border hover:bg-transparent ",
                currentPage === paginationItem && "bg-yellow-main text-black",
              )}
              scroll={false}
              href={createPageURL(paginationItem)}
            >
              {paginationItem}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      {/* <PaginationNext
        className="hover:bg-transparent border border-[#6B6E76] rounded-[6px] hover:text-white size-10 p-0"
        scroll={false}
        href={createNextPage()}
      /> */}
    </Pagination>
  );
};
