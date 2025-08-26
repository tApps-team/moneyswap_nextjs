"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { blacklistColumns } from "../model/columns";
import { CryptoTableColumnsBlackList } from "../model/columns";

interface DataTableProps {
  data: CryptoTableColumnsBlackList[];
}

export function BlacklistCryptoTable(props: DataTableProps) {
  const { data } = props;
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const filtered = data.filter((item) => 
      item.exchangerName.ru.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [data, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns: blacklistColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
    },
  });

  const handleShowMore = () => {
    setPagination((prev) => ({
      ...prev,
      pageSize: prev.pageSize + 10,
    }));
  };

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
          <Table className="border-separate border-spacing-y-4 -mt-12">
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
                  <TableCell colSpan={blacklistColumns.length} className="h-24 text-center">
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