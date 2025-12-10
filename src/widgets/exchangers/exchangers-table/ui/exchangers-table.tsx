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
import { useState, useEffect, useMemo, useCallback } from "react";
import { Exchanger, ExchangerCard, getExchangers } from "@/entities/exchanger";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { MobileExchangersSorting, MobileSortState } from "./mobile-exchangers-sorting";

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

  const [userAmount, setUserAmount] = useState<number | null>(null);
  const [inputType, setInputType] = useState<'give' | 'get'>('give');
  const [mobileSort, setMobileSort] = useState<MobileSortState>({
    key: null,
    direction: "asc",
  });
  
  useEffect(() => {
    const handleAmountChange = (e: CustomEvent<{ value: number; type: 'give' | 'get' }>) => {
      setUserAmount(e.detail.value);
      setInputType(e.detail.type);
    };
    
    window.addEventListener('amountChange', handleAmountChange as EventListener);
    return () => {
      window.removeEventListener('amountChange', handleAmountChange as EventListener);
    };
  }, []);

  const data = useMemo(() => 
    exchangers?.map(exchanger => {
      // Если пользователь еще не менял значения, показываем оригинальные значения обменника
      if (userAmount === null) {
        return exchanger;
      }

      const originalRate = exchanger.out_count / exchanger.in_count;

      if (inputType === 'give') {
        // Если пользователь изменил in_count (give)
        const newInCount = userAmount;
        const newOutCount = Number((newInCount * originalRate).toFixed(3));
        return {
          ...exchanger,
          in_count: newInCount,
          out_count: newOutCount
        };
      } else {
        // Если пользователь изменил out_count (get)
        const newOutCount = userAmount;
        const newInCount = Number((newOutCount / originalRate).toFixed(3));
        return {
          ...exchanger,
          in_count: newInCount,
          out_count: newOutCount
        };
      }
    }) || []
  , [exchangers, userAmount, inputType]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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

  const normalizeMinAmount = useCallback((exchanger: Exchanger) => {
    if (!exchanger.min_amount) {
      return Number.POSITIVE_INFINITY;
    }
    const numeric = Number(String(exchanger.min_amount).replace(/\s+/g, ""));
    return Number.isFinite(numeric) ? numeric : Number.POSITIVE_INFINITY;
  }, []);

  const sortedMobileData = useMemo(() => {
    const list = [...data];

    if (!mobileSort.key) {
      return list;
    }

    const directionMultiplier = mobileSort.direction === "asc" ? 1 : -1;

    switch (mobileSort.key) {
      case "name":
        return list.sort((a, b) => directionMultiplier * a.name.ru.localeCompare(b.name.ru));
      case "giveCurrency":
        return list.sort((a, b) => directionMultiplier * (a.in_count - b.in_count));
      case "getCurrency":
        return list.sort((a, b) => directionMultiplier * (a.out_count - b.out_count));
      case "minAmount":
        return list.sort((a, b) => directionMultiplier * (normalizeMinAmount(a) - normalizeMinAmount(b)));
      case "reviews": {
        const total = (item: Exchanger) =>
          item.review_count.positive + item.review_count.neutral + item.review_count.negative;
        return list.sort((a, b) => directionMultiplier * (total(a) - total(b)));
      }
      default:
        return list;
    }
  }, [data, mobileSort, normalizeMinAmount]);

  const handleShowMore = () => {
    setPagination((prev) => ({
      ...prev,
      pageSize: prev.pageSize + 10,
    }));
  };

  if (isDesktop) {
    return (
      <div className="flex flex-col mt-10 gap-12 w-full">
        <div className="rounded-[15px] bg-new-dark-grey flex flex-col gap-11  text-white xl:px-10 px-6 pb-14">
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
            <TableBody className="[&_tr]:bg-new-grey">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn(
                      "relative",
                      row.original.is_vip
                        ? "bg-new-grey border-2 border-yellow-main rounded-[15px] !shadow-[inset_0px_0px_2px_2px_rgb(246_255_95)]"
                        : "bg-new-grey"
                    )}
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
              className="lg:mt-0 md:mt-6 mt-4 mx-auto w-fit xl:text-base mobile-xl:text-sm text-xs px-6 py-4 rounded-[10px] text-black bg-yellow-main hover:bg-new-light-grey hover:text-font-light-grey cursor-pointer font-semibold"
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

  const sortedMobileExchangers = sortedMobileData.slice(0, pagination.pageSize);

  return (
    <div className="flex flex-col lg:mt-10 mt-0 gap-4 w-full">
      <MobileExchangersSorting
        value={mobileSort}
        onChange={setMobileSort}
        giveCurrency={exchangers?.[0]?.valute_from || ''}
        getCurrency={exchangers?.[0]?.valute_to || ''}
      />
      {sortedMobileExchangers.map((exchanger) => (
        <ExchangerCard key={exchanger.id} exchanger={exchanger} city={cityName} />
      ))}
      <Button
        onClick={handleShowMore}
        disabled={sortedMobileExchangers.length >= data.length}
        className="lg:mt-0 md:mt-6 mt-4 mx-auto w-fit mobile-xl:sm text-xs px-6 py-4 rounded-[10px] text-black bg-yellow-main hover:bg-new-light-grey hover:text-font-light-grey cursor-pointer font-semibold"
      >
        Показать ещё
      </Button>
    </div>
  );
}
