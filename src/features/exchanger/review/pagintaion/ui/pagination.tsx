"use client";
import { usePathname, useSearchParams } from "next/navigation";
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
    if (currentPage > 0) {
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
  const paginationArray = Array.from(Array(totalPages), (item, index) => index + 1);
  console.log(paginationArray);
  return (
    <Pagination>
      <PaginationPrevious scroll={false} href={createPrevPage()} />
      <PaginationContent className="rounded-full border">
        {paginationArray.map((paginationItem) => (
          <PaginationItem key={paginationItem}>
            <PaginationLink className="" scroll={false} href={createPageURL(paginationItem)}>
              {paginationItem}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext scroll={false} href={createNextPage()} />
    </Pagination>
  );
};
