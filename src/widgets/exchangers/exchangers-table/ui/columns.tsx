"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCurrecnyStore } from "@/entities/currency";
import { useDirectionStore } from "@/entities/direction";
import { Exchanger, ExchangerMarker } from "@/entities/exchanger";
import { GiveCell } from "../columns/ui/giveCell";

export type ExchangerTable = Exchanger;

export const columns: ColumnDef<ExchangerTable>[] = [
  {
    accessorKey: `name.ru`,
    id: "name",
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
      <Link href={row.original.partner_link} target="_blank">
        <p className="font-semibold text-base">{row.original?.name?.ru}</p>
      </Link>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.in_count,
    id: "Give",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ОТДАЕТЕ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-6 w-6" />
          ) : (
            <ChevronUp className="ml-2 h-6 w-6" />
          )}
        </button>
      );
    },
    sortDescFirst: false,
    sortUndefined: "last",
    cell: ({ row, cell }) => <GiveCell row={cell.row} />,
  },
  {
    accessorFn: (exchanger) => exchanger.out_count,
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ПОЛУЧАЕТЕ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-6 w-6" />
          ) : (
            <ChevronUp className="ml-2 h-6 w-6" />
          )}
        </button>
      );
    },
    id: "Get",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-end">
          <div className="text-yellow-main text-base">{row.original.out_count}</div>
          <div className="text-sm">{row.original.valute_to}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "in_count",
    header: "Сумма Обмена",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <div className="text-xs">ОТ</div>
          <div className="font-medium">{row.original.min_amount}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-xs">ДО</div>
          <div className="font-medium">{row.original.max_amount}</div>
        </div>
      </div>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.review_count.positive,
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
      <div className="flex gap-1 border rounded-full hover:border-yellow-main w-20 px-4 py-2">
        <div className="text-yellow-main">{row.original.review_count.positive}</div>
        <span>/</span>
        <div className="text-red-600">{row.original.review_count.negative}</div>
      </div>
    ),
  },
];
