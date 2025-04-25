"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { CryptoExchanger } from "@/entities/exchanger";
import { routes } from "@/shared/router";

export type CryptoTableColumns = CryptoExchanger;

export const cryptoColumns: ColumnDef<CryptoTableColumns>[] = [
  {
    accessorKey: "exchangerName",
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
      <p className="leading-none font-semibold xl:text-xl text-base truncate max-w-[18vw]">
        {row.getValue("exchangerName")}
      </p>
    ),
  },
  {
    accessorKey: "workStatus",
    header: "СТАТУС",
    cell: ({ row }) => {
      const workStatus = row.original.workStatus ? "Активен" : "Не активен";
      return (
        <p className="leading-none uppercase xl:text-xl text-base text-yellow-main truncate">
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
    //TODO refactor as href
    accessorKey: "id",
    header: () => {
      return <p className="hidden lg:block"></p>;
    },
    cell: ({ row }) => (
      <Link
        className="leading-none text-base hidden text-center bg-[#5C5E62] lg:block rounded-[10px] py-3 font-normal cursor-pointer hover:bg-yellow-main hover:text-black transition-all duration-500"
        href={{
          pathname: `${routes.exchangers}/exchanger-${row.original.id}`,
          query: { "exchanger-marker": row.original.exchange_marker },
        }}
      >
        Подробнее
      </Link>
    ),
  },
];
