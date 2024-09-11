import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui";

export const ExchangerPagination = () => {
  return (
    <Pagination>
      <PaginationPrevious href="#" />
      <PaginationContent className="rounded-full border">
        <PaginationItem></PaginationItem>
        <PaginationItem className="">
          <PaginationLink className="" href="#">
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
      <PaginationNext href="#" />
    </Pagination>
  );
};
