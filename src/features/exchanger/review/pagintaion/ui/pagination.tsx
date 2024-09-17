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
  return (
    <Pagination>
      <PaginationPrevious href={createPrevPage()} />
      <PaginationContent className="rounded-full border">
        <PaginationItem></PaginationItem>
        <PaginationItem className="">
          <PaginationLink scroll={false} className="" href="#">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem></PaginationItem>
      </PaginationContent>
      <PaginationNext href={createNextPage()} />
    </Pagination>
  );
};
