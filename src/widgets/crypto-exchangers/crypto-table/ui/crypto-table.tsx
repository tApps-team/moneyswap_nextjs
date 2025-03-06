"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { routes } from "@/shared/router";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { cryptoColumns } from "../model/columns";
import { CryptoTableColumns } from "../model/columns";

interface DataTableProps<TValue> {
  //   columns: ColumnDef<CryptoTableColumns, TValue>[];
  data: CryptoTableColumns[];
}

export function CryptoTable<TData, TValue>(props: DataTableProps<TData>) {
  const { data } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Mobile-specific pagination state
  const [currentPage, setCurrentPage] = useState(0);

  const table = useReactTable({
    data,
    columns: cryptoColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: false,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleShowMore = () => {
    setPagination((prev) => ({
      ...prev,
      pageSize: prev.pageSize + 10,
    }));
  };

  // Mobile-specific pagination logic
  const totalPages = Math.ceil(data.length / pagination.pageSize);
  const paginatedData = data.slice(
    currentPage * pagination.pageSize,
    (currentPage + 1) * pagination.pageSize,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-12 w-full">
        <div className="rounded-[15px] bg-new-dark-grey flex flex-col xl:gap-10 gap-6 text-white xl:px-10 px-6 xl:pb-14 pb-10">
          <Table className="border-separate border-spacing-y-4">
            <TableHeader className="">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow className="border-none" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="xl:text-xl text-base uppercase py-6 px-4 text-light-gray font-bold"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-none bg-new-grey xl:rounded-[15px] rounded-[10px]"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          className="xl:first:rounded-l-[15px] first:rounded-l-[10px] xl:last:rounded-r-[15px] last:rounded-r-[10px]"
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={cryptoColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center  justify-center">
            <Button
              onClick={handleShowMore}
              className="xl:text-base text-sm rounded-[10px] font-semibold h-[52px]  bg-yellow-main py-4 text-black px-20"
              disabled={
                table.getRowModel().rows.length >= data.length ||
                table.getRowModel().rows.length < 1
              }
            >
              Показать ещё
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile rendering with pagination
  return (
    <div className="flex flex-col mobile-xl:gap-10 gap-6 w-full">
      <div className=" text-white flex flex-col gap-2.5">
        {paginatedData.map((exchanger) => (
          <div
            key={exchanger.id + exchanger.exchangerName}
            className="mobile:p-5 p-4 bg-new-dark-grey rounded-[15px] flex flex-col gap-2.5 justify-between"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="text-base font-semibold max-w-[45vw] truncate">
                  {exchanger?.exchangerName}
                </p>
                <p
                  className={cn(
                    exchanger?.workStatus ? "text-yellow-main" : " text-[#FF6060]",
                    "mobile-xl:text-base mobile:text-sm text-xs",
                  )}
                >
                  {exchanger?.workStatus ? "АКТИВЕН" : "НЕ АКТИВЕН"}
                </p>
              </div>
              <Link
                href={{
                  pathname: `${routes.exchangers}/exchanger-${exchanger?.id}`,
                  query: { "exchanger-marker": exchanger?.exchange_marker },
                }}
                className="self-start mobile:h-[38px] h-[32px] flex justify-center items-center gap-1 mobile:w-40 w-fit py-1.5 px-3 text-2xs rounded-[6px] border border-[#575A62] cursor-pointer hover:bg-yellow-main hover:text-black [&>span]:hover:text-black [&>div>span]:hover:text-black hover:border-yellow-main transition-all duration-500"
              >
                <span className="text-light-gray mobile-xl:text-base mobile:text-sm text-xs font-normal">
                  Отзывы
                </span>
                <div className="flex gap-1 items-center mobile:text-sm text-xs">
                  <span className="text-yellow-main ">{exchanger?.reviews?.positive}</span>
                  <span>|</span>
                  <span className="text-light-gray">{exchanger?.reviews?.neutral}</span>
                  <span>|</span>
                  <span className="text-red-500">{exchanger?.reviews?.negative}</span>
                </div>
              </Link>
            </div>
            <hr className="w-full border-[#575A62]" />
            <div className="flex w-full justify-between items-center">
              <div className="mobile-xl:text-base mobile:text-sm text-xs">
                <p className="uppercase font-semibold">Резервы: {exchanger?.reserves || "—"}</p>
                <p className="font-medium">Курсов: {exchanger?.courses || "—"}</p>
              </div>
              <Link
                href={{
                  pathname: `${routes.exchangers}/exchanger-${exchanger?.id}`,
                  query: { "exchanger-marker": exchanger?.exchange_marker },
                }}
                className="mobile-xl:text-base mobile:text-sm text-xs self-end flex justify-center items-center text-white mobile:w-40 w-fit text-center mobile:h-[38px] h-[32px] py-2 px-7 text-2xs rounded-[6px] bg-[#43464E]  font-normal cursor-pointer hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500 leading-none"
              >
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Pagination Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="bg-new-dark-grey h-10 w-1/2 border-2 border-new-light-grey uppercase rounded-full font-normal"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="bg-new-dark-grey h-10 w-1/2 border-2 border-new-light-grey uppercase rounded-full font-normal"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
