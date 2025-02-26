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
  const { data: exchangers = [], error } = useQuery({
    queryKey: [params],
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    queryFn: async () => (await getExchangers(params)).exchangers,
  });
  console.log(error);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
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
        <div className="rounded-[15px] bg-new-dark-grey flex flex-col gap-11  text-white px-10 pb-14">
          <Table className=" border-separate border-spacing-y-4">
            <TableHeader className="">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow className="border-none" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="uppercase  py-6 px-4 border-none text-light-gray font-bold"
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
            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-none bg-new-grey"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        rowSpan={1}
                        className="py-3 first:rounded-l-[15px] last:rounded-r-[15px]"
                        key={cell.id}
                      >
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
          <div className="flex items-center justify-center">
            <Button
              onClick={handleShowMore}
              className="lg:mt-0 md:mt-6 mt-4 mx-auto w-fit mobile-xl:sm text-xs px-6 py-4 rounded-[10px] text-black bg-yellow-main hover:bg-new-light-grey hover:text-font-light-grey cursor-pointer font-normal"
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

  const mobileExchangers = data.slice(0, pagination.pageSize);

  return (
    <div className="flex flex-col lg:mt-10 mt-0 gap-4 w-full">
      {mobileExchangers.map((exchanger) => (
        <ExchangerCard key={exchanger.id} exchanger={exchanger} city={cityName} />
      ))}
      <Button
        onClick={handleShowMore}
        disabled={mobileExchangers.length >= data.length}
        className="lg:mt-0 md:mt-6 mt-4 mx-auto w-fit mobile-xl:sm text-xs px-6 py-4 rounded-[10px] text-black bg-yellow-main hover:bg-new-light-grey hover:text-font-light-grey cursor-pointer font-normal"
      >
        Показать ещё
      </Button>
    </div>
  );
}
