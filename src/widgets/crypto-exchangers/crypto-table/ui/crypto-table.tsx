"use client";
import {
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
import { useState, useEffect } from "react";
import { cn, useMediaQuery } from "@/shared/lib";
import { routes } from "@/shared/router";
import { ExchangerStatus } from "@/shared/types";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { cryptoColumns } from "../model/columns";
import { CryptoTableColumns } from "../model/columns";
import { MobileCryptoSorting, CryptoMobileSort } from "./mobile-crypto-sorting";

interface DataTableProps<TValue> {
  data: CryptoTableColumns[];
}

export function CryptoTable<TData, TValue>(props: DataTableProps<TData>) {
  const { data } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [rowSelection, setRowSelection] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  // Mobile-specific sorting state
  const [mobileSort, setMobileSort] = useState<CryptoMobileSort>({
    key: null,
    direction: "asc",
  });
  // Mobile-specific pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [paginatedData, setPaginatedData] = useState(
    data.slice(currentPage * pagination.pageSize, (currentPage + 1) * pagination.pageSize),
  );

  useEffect(() => {
    let processed = [...data];
    
    // Фильтрация по поиску
    if (searchValue) {
      processed = processed.filter((item) => 
        item.exchangerName.ru.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    // Мобильная сортировка
    if (mobileSort.key) {
      processed.sort((a, b) => {
        let comparison = 0;
        
        switch (mobileSort.key) {
          case "name":
            comparison = a.exchangerName.ru.localeCompare(b.exchangerName.ru);
            break;
          case "status": {
            const statusOrder = {
              [ExchangerStatus.active]: 1,
              [ExchangerStatus.inactive]: 2,
              [ExchangerStatus.disabled]: 3,
            };
            const aOrder = statusOrder[a.workStatus] || 0;
            const bOrder = statusOrder[b.workStatus] || 0;
            comparison = aOrder - bOrder;
            break;
          }
          case "reserves": {
            const aStr = typeof a.reserves === 'string' ? a.reserves : String(a.reserves || '');
            const bStr = typeof b.reserves === 'string' ? b.reserves : String(b.reserves || '');
            const aNum = Number(aStr.replace(/[^0-9]/g, '')) || 0;
            const bNum = Number(bStr.replace(/[^0-9]/g, '')) || 0;
            comparison = aNum - bNum;
            break;
          }
          case "courses": {
            const aStr = typeof a.courses === 'string' ? a.courses : String(a.courses || '');
            const bStr = typeof b.courses === 'string' ? b.courses : String(b.courses || '');
            const aNum = Number(aStr.replace(/[^0-9]/g, '')) || 0;
            const bNum = Number(bStr.replace(/[^0-9]/g, '')) || 0;
            comparison = aNum - bNum;
            break;
          }
          case "reviews": {
            const aTotal = (a.reviews?.positive || 0) + (a.reviews?.neutral || 0) + (a.reviews?.negative || 0);
            const bTotal = (b.reviews?.positive || 0) + (b.reviews?.neutral || 0) + (b.reviews?.negative || 0);
            comparison = aTotal - bTotal;
            break;
          }
        }
        
        return mobileSort.direction === "asc" ? comparison : -comparison;
      });
    }
    
    setFilteredData(processed);
    setCurrentPage(0);
    setPaginatedData(processed.slice(0, pagination.pageSize));
  }, [data, searchValue, mobileSort]);

  useEffect(() => {
    setPaginatedData(
      filteredData.slice(
        currentPage * pagination.pageSize,
        (currentPage + 1) * pagination.pageSize
      )
    );
  }, [currentPage, filteredData, pagination.pageSize]);

  const table = useReactTable({
    data: filteredData,
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
  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

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
      <div className="w-full flex flex-col gap-12">
        <div className="flex flex-col xl:gap-10 gap-6 text-white xl:px-10 px-6 xl:pb-14 pb-10 rounded-[15px] bg-new-dark-grey">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск обменника..."
            className="mt-12 -mb-6 px-4 py-3 text-xl text-white bg-new-grey rounded-[10px] outline-none focus:shadow-[inset_0_0_1px_1px_rgba(246,255,95,1)] focus:placeholder:opacity-0 placeholder:bg-opacity-100 transition-all duration-200"
          />
          <Table className="border-separate border-spacing-y-4">
            <TableHeader>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow className="border-none" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="py-6 px-4 xl:text-xl text-base uppercase text-light-gray font-bold"
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="xl:first:rounded-l-[15px] first:rounded-l-[10px] xl:last:rounded-r-[15px] last:rounded-r-[10px]"
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
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
          <div className="flex items-center justify-center">
            <Button
              onClick={handleShowMore}
              className="h-[52px] px-20 py-4 xl:text-base text-sm font-semibold text-black bg-yellow-main rounded-[10px]"
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
    <section className="w-full">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Поиск обменника..."
        className="w-full mb-4 px-3 py-2 text-base text-white bg-new-grey rounded-[7px] outline-none focus:shadow-[inset_0_0_1px_1px_rgba(246,255,95,1)] focus:placeholder:opacity-0 placeholder:bg-opacity-100 transition-all duration-200"
      />
      
      <div className="w-full mb-4">
        <MobileCryptoSorting value={mobileSort} onChange={setMobileSort} />
      </div>

      <div className="w-full flex flex-col mobile-xl:gap-10 gap-6">
        <div className="flex flex-col gap-2.5 text-white">
          {paginatedData.length > 0 ? paginatedData.map((exchanger) => (
            <div
              key={exchanger.id + exchanger.exchangerName.ru}
              className="flex flex-col gap-2.5 justify-between mobile:p-5 p-4 bg-new-dark-grey rounded-[15px]"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start">
                  <p className="max-w-[45vw] text-base font-semibold truncate">
                    {exchanger?.exchangerName.ru}
                  </p>
                  <p
                    className={cn(
                      exchanger?.workStatus === ExchangerStatus.active ? "text-yellow-main" : exchanger?.workStatus === ExchangerStatus.inactive ? "text-font-light-grey" : exchanger?.workStatus === ExchangerStatus.disabled ? "text-[#FF0000]" : "text-[#FF0000]",
                      "mobile-xl:text-base mobile:text-sm text-xs uppercase"
                    )}
                  >
                    {exchanger?.workStatus === ExchangerStatus.active ? "Активен" : exchanger?.workStatus === ExchangerStatus.inactive ? "Неактивен" : exchanger?.workStatus === ExchangerStatus.disabled ? "Отключён" : "___"}
                  </p>
                </div>
                <Link
                  href={{
                    pathname: `${routes.exchangers}/exchanger-${exchanger?.id}`,
                  }}
                  className="self-start flex justify-center items-center gap-1 mobile:h-[38px] h-[32px] mobile:w-40 w-fit py-1.5 px-3 text-2xs rounded-[6px] border border-[#575A62] cursor-pointer hover:bg-yellow-main hover:text-black [&>span]:hover:text-black [&>div>span]:hover:text-black hover:border-yellow-main transition-all duration-500"
                >
                  <span className="text-light-gray mobile-xl:text-base mobile:text-sm text-xs font-normal">
                    Отзывы
                  </span>
                  <div className="flex items-center gap-1 mobile:text-sm text-xs">
                    <span className="text-yellow-main">{exchanger?.reviews?.positive}</span>
                    <span>|</span>
                    <span className="text-light-gray">{exchanger?.reviews?.neutral}</span>
                    <span>|</span>
                    <span className="text-red-500">{exchanger?.reviews?.negative}</span>
                  </div>
                </Link>
              </div>
              <hr className="w-full border-[#575A62]" />
              <div className="flex w-full items-center justify-between">
                <div className="mobile-xl:text-base mobile:text-sm text-xs">
                  <p className="uppercase font-semibold">Резервы: {exchanger?.reserves || "—"}</p>
                  <p className="font-medium">Курсов: {exchanger?.courses || "—"}</p>
                </div>
                <Link
                  href={{
                    pathname: `${routes.exchangers}/exchanger-${exchanger?.id}`,
                  }}
                  className="self-end flex justify-center items-center mobile:w-40 w-fit mobile:h-[38px] h-[32px] py-2 px-7 mobile-xl:text-base mobile:text-sm text-xs text-center text-white font-normal leading-none rounded-[6px] bg-[#43464E] cursor-pointer hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          )) : <div className="flex justify-center items-center h-24 text-center">
            <p className="text-light-gray text-sm">Ничего не найдено...</p>
          </div>}
        </div>
        <div className="flex justify-center gap-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="w-1/2 h-10 font-normal uppercase bg-new-dark-grey border-2 border-new-light-grey rounded-full"
            >
              <ChevronLeft />
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="w-1/2 h-10 font-normal uppercase bg-new-dark-grey border-2 border-new-light-grey rounded-full"
            >
              <ChevronRight />
            </Button>
          </div>
      </div>
    </section>
  );
}
