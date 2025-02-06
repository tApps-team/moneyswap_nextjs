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
          className="flex items-center uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Обменник
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-6 w-6" />
          ) : (
            <ChevronUp className="ml-2 h-6 w-6" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <p className="font-medium text-base truncate max-w-[18vw]">{row.getValue("exchangerName")}</p>
    ),
  },
  {
    accessorKey: "workStatus",
    header: "СТАТУС",
    cell: ({ row }) => {
      const workStatus = row.original.workStatus ? "Активен" : "Не активен";
      return <p className="uppercase md:text-xs text-2xs truncate">{workStatus}</p>;
    },
  },
  {
    accessorKey: "reserves",
    header: "РЕЗЕРВЫ",
    cell: ({ row }) => (
      <p className="uppercase md:text-sm text-xs font-medium truncate">{row.original.reserves}</p>
    ),
  },
  {
    accessorKey: "courses",
    header: "КУРСОВ",
    cell: ({ row }) => <p className="uppercase md:text-sm text-xs">{row.original.courses}</p>,
  },
  {
    accessorFn: (review) => review.reviews.positive,
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ОТЗЫВЫ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-6 w-6" />
          ) : (
            <ChevronUp className="ml-2 h-6 w-6" />
          )}
        </button>
      );
    },
    id: "Review",
    cell: ({ row }) => (
      <div className="flex gap-1 border rounded-[6px] cursor-pointer hover:border-yellow-main w-20 px-3 py-2">
        <div className="text-yellow-main">{row.original.reviews.positive}</div>
        <span>|</span>
        <div className="text-white">{row.original.reviews.neutral}</div>
        <span>|</span>
        <div className="text-[#FF0000]">{row.original.reviews.negative}</div>
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
        className="hidden text-center bg-[#5C5E62] lg:block rounded-[10px] py-3 font-semibold  border-light-gray cursor-pointer hover:bg-yellow-main hover:text-black hover:border-yellow-main transition-all duration-500"
        href={{
          pathname: `${routes.exchangers}/exchanger-${row.original.id}`,
          query: { "exchanger-marker": row.original.exchange_marker },
        }}
      >
        ПОДРОБНЕЕ
      </Link>
    ),
  },
];
