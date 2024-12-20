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
  const isDesktop = useMediaQuery("(min-width: 640px)");
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
      <div className="flex flex-col mt-10 gap-12 w-full">
        <div className="rounded-3xl bg-dark-gray text-white shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
          <Table className="">
            <TableHeader className="">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="uppercase py-6 px-4 text-light-gray font-medium"
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
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
        </div>
        <Button
          onClick={handleShowMore}
          disabled={
            table.getRowModel().rows.length >= data.length || table.getRowModel().rows.length < 1
          }
          className="bg-dark-gray h-14 w-[200px] mx-auto border-2 border-light-gray uppercase rounded-full font-normal"
        >
          Показать ещё
        </Button>
      </div>
    );
  }

  // Mobile rendering with pagination
  return (
    <div className="flex flex-col mt-10 gap-12 w-full">
      <div className="rounded-3xl bg-dark-gray text-white shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
        {paginatedData.map((exchanger) => (
          <div
            key={exchanger.id + exchanger.exchangerName}
            className="p-3 border-b last:border-none border-light-gray flex items-center justify-between"
          >
            <div className="flex flex-col  min-w-0 gap-2">
              <p className="text-yellow-main text-sm truncate font-normal">
                {exchanger.exchangerName}
              </p>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <p className="text-light-gray text-xs font-light">КУРСОВ:</p>
                  <p className="text-xs">{exchanger.courses || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-light-gray text-xs font-light">РЕЗЕРВ:</p>
                  <p className="text-xs">{exchanger.reserves || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-light-gray text-xs font-light">СТАТУС:</p>
                  <p
                    className={cn(
                      "text-xs ",
                      exchanger.workStatus ? "text-yellow-main" : "text-red-500",
                    )}
                  >
                    {exchanger.workStatus ? "РАБОТАЕТ" : "НЕ РАБОТАЕТ"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={{
                  pathname: `${routes.exchangers}/exchanger-${exchanger.id}`,
                  query: { "exchanger-marker": exchanger.exchange_marker },
                }}
                className="flex items-center  gap-1 max-w-30  py-2 px-3 text-2xs rounded-full bg-dark-gray border border-light-gray cursor-pointer hover:bg-yellow-main hover:text-black [&>span]:hover:text-black [&>div>span]:hover:text-black hover:border-yellow-main transition-all duration-500"
              >
                <span className="text-light-gray font-medium">ОТЗЫВЫ</span>
                <div className="flex gap-1 items-center">
                  <span className="text-yellow-main">{exchanger.reviews.positive}</span>
                  <span>/</span>
                  <span className="text-red-500">{exchanger.reviews.negative}</span>
                </div>
              </Link>
              <Link
                href={{
                  pathname: `${routes.exchangers}/exchanger-${exchanger.id}`,
                  query: { "exchanger-marker": exchanger.exchange_marker },
                }}
                className="flex text-light-gray max-w-30  items-center py-2 px-3 text-2xs rounded-full bg-dark-gray border font-medium border-light-gray cursor-pointer hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
              >
                ПОДРОБНЕЕ
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
          className="bg-dark-gray h-10 w-1/2 border-2 border-light-gray uppercase rounded-full font-normal"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="bg-dark-gray h-10 w-1/2 border-2 border-light-gray uppercase rounded-full font-normal"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
