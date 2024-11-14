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
import Link from "next/link";
import { useState } from "react";
import { Exchanger } from "@/entities/exchanger";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
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
                      className="uppercase py-6 px-4 text-light-gray font-semibold"
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
                          {/* hydration error */}
                          {/* <Link href={cell.row.original.url} target="_blank"> */}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {/* </Link> */}
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
          className="bg-dark-gray h-14 w-[200px] mx-auto border-2 border-light-gray uppercase rounded-full"
        >
          Показать ещё
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-10 gap-12 w-full">
      <div className="rounded-3xl bg-dark-gray text-white shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
        {data.map((exchanger) => (
          <div
            key={exchanger.id + exchanger.exchangerName}
            className="p-3 border-b last:border-none border-light-gray flex items-center justify-between"
          >
            <div className="flex flex-col  gap-2">
              <p className="text-yellow-main">{exchanger.exchangerName}</p>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <p className="text-light-gray">КУРСОВ:</p>
                  <p className="text-sm">{exchanger.courses}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-light-gray">РЕЗЕРВ:</p>
                  <p className="text-sm">{exchanger.reserves}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-light-gray">СТАТУС:</p>
                  <p
                    className={cn(
                      "text-sm",
                      exchanger.workStatus ? "text-yellow-main" : "text-red-700",
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
                  pathname: `/crypto-exchangers/exchanger-${exchanger.id}`,
                  query: { "exchanger-marker": exchanger.exchange_marker },
                }}
                className="flex items-center  gap-2 max-w-32  p-3 text-2xs rounded-full bg-dark-gray border border-light-gray"
              >
                <span className="text-light-gray">ОТЗЫВЫ</span>
                <div className="flex gap-1 items-center">
                  <span className="text-yellow-main">{exchanger.reviews.positive}</span>
                  <span>/</span>
                  <span className="text-red-700">{exchanger.reviews.negative}</span>
                </div>
              </Link>
              <Link
                href={{
                  pathname: `/crypto-exchangers/exchanger-${exchanger.id}`,
                  query: { "exchanger-marker": exchanger.exchange_marker },
                }}
                className="flex text-light-gray max-w-32 items-center p-3 text-2xs rounded-full bg-dark-gray border border-light-gray"
              >
                ПОДРОБНЕЕ
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleShowMore}
        disabled={
          table.getRowModel().rows.length >= data.length || table.getRowModel().rows.length < 1
        }
        className="bg-dark-gray h-14 w-[200px] mx-auto border-2 border-light-gray uppercase rounded-full"
      >
        Показать ещё
      </Button>
    </div>
  );
}
