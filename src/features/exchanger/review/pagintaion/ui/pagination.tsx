import { ReviewsByExchangeDTOResponse } from "@/entities/exchanger-review/api/exchanger-review-api-dto";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui";

type ExchangerPaginationProps = {};
export const ExchangerPagination = (props: ExchangerPaginationProps) => {
  return (
    <Pagination>
      <PaginationPrevious href="#" />
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
      <PaginationNext href="#" />
    </Pagination>
  );
};
