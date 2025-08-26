"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { CryptoExchanger, CryptoExchangerBlackList } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerStatus } from "@/shared/types";

export type CryptoTableColumns = CryptoExchanger;
export type CryptoTableColumnsBlackList = CryptoExchangerBlackList;

export const cryptoColumns: ColumnDef<CryptoTableColumns>[] = [
  {
    accessorFn: (row) => row.exchangerName?.ru,
    id: "exchangerName",
    header: ({ column }) => {
      return (
        <button
          className="leading-none flex items-center uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Обменник
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <p className="leading-none font-semibold xl:text-xl text-base truncate w-[18vw]">
        {row.original?.exchangerName?.ru}
      </p>
    ),
  },
  {
    accessorKey: "workStatus",
    header: ({ column }) => {
      return (
        <button
          className="leading-none flex items-center uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          СТАТУС
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const statusOrder = {
        [ExchangerStatus.active]: 1,
        [ExchangerStatus.inactive]: 2,
        [ExchangerStatus.disabled]: 3,
      };
      
      const a = statusOrder[rowA.original.workStatus] || 0;
      const b = statusOrder[rowB.original.workStatus] || 0;
      
      return a - b;
    },
    cell: ({ row }) => {
      const workStatus = row.original.workStatus === ExchangerStatus.active ? "Активен" : row.original.workStatus == ExchangerStatus.inactive ? "Неактивен" : row.original.workStatus === ExchangerStatus.disabled ? "Отключён" : "___";
      return (
        <p className={`leading-none uppercase xl:text-xl text-base truncate ${row.original.workStatus === ExchangerStatus.active ? "text-yellow-main" : row.original.workStatus === ExchangerStatus.inactive ? "text-font-light-grey" : row.original.workStatus === ExchangerStatus.disabled ? "text-[#FF0000]" : "text-[#FF0000]"}`}>
          {workStatus}
        </p>
      );
    },
  },
  {
    accessorKey: "reserves",
    header: ({ column }) => {
      return (
        <button
          className="leading-none flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          РЕЗЕРВЫ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = Number(rowA.original.reserves?.replace(/[^0-9]/g, '')) || 0;
      const b = Number(rowB.original.reserves?.replace(/[^0-9]/g, '')) || 0;
      return a < b ? -1 : a > b ? 1 : 0;
    },
    cell: ({ row }) => (
      <p className="leading-none uppercase xl:text-xl text-base font-semibold truncate max-w-[10vw]">
        {row.original.reserves || "---"}
      </p>
    ),
  },
  {
    accessorKey: "courses",
    header: ({ column }) => {
      return (
        <button
          className="leading-none flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          КУРСОВ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <p className="leading-none uppercase xl:text-xl text-base semibold">{row.original.courses}</p>
    ),
  },
  {
    accessorFn: (review) => review.reviews.positive,
    header: ({ column }) => {
      return (
        <button
          className="leading-none flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ОТЗЫВЫ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    id: "Review",
    cell: ({ row }) => (
      <div className="text-sm font-semibold flex items-center justify-center gap-1 rounded-[6px] cursor-pointer hover:border-yellow-main w-20 px-2 py-1 border-[1px] border-font-dark-grey">
        <div className="leading-none text-yellow-main">{row.original.reviews.positive}</div>
        <span>|</span>
        <div className="leading-none text-white">{row.original.reviews.neutral}</div>
        <span>|</span>
        <div className="leading-none text-[#FF0000]">{row.original.reviews.negative}</div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: () => {
      return <p className="hidden lg:block"></p>;
    },
    cell: ({ row }) => (
      <Link
        className="leading-none text-base hidden text-center bg-[#5C5E62] lg:block rounded-[10px] py-3 font-normal cursor-pointer hover:bg-yellow-main hover:text-black transition-all duration-500"
        href={{
          pathname: `${routes.exchangers}/exchanger-${row.original.id}__${row.original.exchange_marker}`,
        }}
      >
        Подробнее
      </Link>
    ),
  },
];

// Упрощенные колонки для blacklist страницы
export const blacklistColumns: ColumnDef<CryptoExchangerBlackList>[] = [
  {
    accessorFn: (row) => row.exchangerName?.ru,
    id: "exchangerName",
    header: () => {
      return (
        <p
          className="block"
        >
        </p>
      );
    },
    cell: ({ row }) => (
      <p className="leading-none font-semibold xl:text-xl text-base truncate w-[30vw]">
        {row.original?.exchangerName?.ru}
      </p>
    ),
  },
  {
    accessorKey: "id",
    header: () => {
      return <p className="block"></p>;
    },
    cell: ({ row }) => (
      <Link
        className="block leading-none mobile-xl:text-base text-xs text-center bg-[#5C5E62] mobile-xl:rounded-[10px] rounded-[5px] mobile-xl:py-3 py-2 px-2 font-normal cursor-pointer hover:bg-yellow-main hover:text-black transition-all duration-500"
        href={{
          pathname: `${routes.blacklist}/exchanger-${row.original.id}__${row.original.exchange_marker}`,
        }}
      >
        Подробнее
      </Link>
    ),
  },
];
