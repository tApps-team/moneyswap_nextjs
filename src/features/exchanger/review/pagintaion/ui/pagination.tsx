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
    const paginationArray = [];
    const maxVisiblePages = 5;

    // Добавляем первую страницу
    paginationArray.push(1);

    // Если страниц больше, чем maxVisiblePages, начинаем добавлять логику с троеточиями
    if (totalPages > maxVisiblePages) {
      if (currentPage <= maxVisiblePages) {
        // Если текущая страница меньше или равна 5
        for (let i = 2; i <= maxVisiblePages; i++) {
          paginationArray.push(i);
        }
        paginationArray.push("...");
        paginationArray.push(totalPages);
      } else if (currentPage > maxVisiblePages) {
        // Если текущая страница больше 5
        paginationArray.push("...");

        // Добавляем страницы вокруг текущей
        const startPage = Math.max(currentPage - 2, 2); // Страницы до текущей
        const endPage = Math.min(currentPage + 2, totalPages - 1); // Страницы после текущей

        for (let i = startPage; i <= endPage; i++) {
          paginationArray.push(i);
        }

        // Если текущая страница не последняя, добавляем троеточие и последнюю страницу
        if (currentPage < totalPages - 2) {
          paginationArray.push("...");
        }
        paginationArray.push(totalPages);
      }
    } else {
      // Если страниц меньше или равно maxVisiblePages, показываем их все
      for (let i = 2; i <= totalPages; i++) {
        paginationArray.push(i);
      }
    }

    setPaginationArray(paginationArray);
  }, [currentPage, totalPages]);
  return (
    <Pagination>
      <PaginationPrevious
        className={cn("hover:bg-transparent hover:text-white ")}
        scroll={false}
        href={createPrevPage()}
      />
      <PaginationContent className="rounded-full border">
        {paginationArray.map((paginationItem) => (
          <PaginationItem key={paginationItem}>
            <PaginationLink
              className={cx(
                "rounded-full transition-all  hover:text-white  hover:border hover:bg-transparent ",
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
      <PaginationNext
        className="hover:bg-transparent hover:text-white "
        scroll={false}
        href={createNextPage()}
      />
    </Pagination>
  );
};
