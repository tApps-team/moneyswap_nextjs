"use client";

import { useQuery } from "@tanstack/react-query";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Exchanger, ExchangerCard, getExchangers } from "@/entities/exchanger";
import { LocationInfo } from "@/entities/location";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";

interface DataTableProps<TValue> {
  columns: ColumnDef<Exchanger, TValue>[];
  data?: Exchanger[];
  cityName?: string;
  params:
    | {
        valute_from: string;
        valute_to: string;
        city: string;
      }
    | {
        valute_from: string;
        valute_to: string;
        city?: undefined;
      };
}

export function ExchangersTable<TData, TValue>({
  columns,
  params,
  cityName,
}: DataTableProps<TValue>) {
  const { data: exchangers = [] } = useQuery({
    queryKey: [params],
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    queryFn: async () => (await getExchangers(params)).exchangers,
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const data = exchangers || [];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
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
        <div className="rounded-3xl bg-dark-gray  text-white shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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

  const mobileExchangers = data.slice(0, pagination.pageSize);

  return (
    <div className="flex flex-col mt-10 gap-4 w-full">
      {mobileExchangers.map((exchanger) => (
        <ExchangerCard key={exchanger.id} exchanger={exchanger} city={cityName} />
      ))}
      <Button
        onClick={handleShowMore}
        disabled={mobileExchangers.length >= data.length}
        className="bg-dark-gray h-14 w-[200px] mx-auto border-2 border-light-gray uppercase rounded-full font-normal"
      >
        Показать ещё
      </Button>
    </div>
  );
}
