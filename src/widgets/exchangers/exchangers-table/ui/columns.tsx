"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Exchanger } from "@/entities/exchanger";
import { GiveCell } from "../columns/ui/giveCell";

export type ExchangerTable = Exchanger;

export const columns: ColumnDef<ExchangerTable>[] = [
  {
    accessorKey: `name.ru`,
    id: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center text-lg uppercase font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="leading-none">Обменник</p>
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    cell: ({ row }) => (
      <Link href={row.original.partner_link || "/"} target="_blank">
        <p className="font-bold text-base">{row.original?.name?.ru}</p>
      </Link>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.in_count,
    id: "Give",

    header: ({ column }) => {
      return (
        <button
          className="flex items-center text-lg font-bold uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="leading-none">Отдаете</p>
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
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
          className="flex items-center text-lg font-bold uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="leading-none">Получаете</p>
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUp className="ml-2 h-5 w-5" />
          )}
        </button>
      );
    },
    id: "Get",

    cell: ({ row }) => {
      return (
        <div className="grid grid-flow-row justify-start items-start justify-items-start">
          <div className="text-yellow-main font-bold text-base truncate max-w-[200px]">
            {row.original.out_count}
          </div>
          <div className="text-sm font-semibold truncate max-w-[200px]">
            {row.original.valute_to}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "in_count",
    header: () => (
      <p className="md:hidden lg:block text-lg font-bold leading-none uppercase">Сумма обмена</p>
    ),
    enableHiding: true,
    cell: ({ row }) => (
      <div className="flex md:hidden lg:block flex-col">
        <div className="flex gap-1 items-center">
          <div className="text-xs font-light uppercase">от</div>
          <div className="text-yellow-main font-semibold">{row.original.min_amount}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-xs font-light uppercase">до</div>
          <div className="text-yellow-main font-semibold">{row.original.max_amount}</div>
        </div>
      </div>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.review_count.positive,
    header: ({ column }) => {
      return (
        <button
          className="flex items-center text-lg font-bold uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="leading-none uppercase">Отзывы</p>
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
      <div className="flex gap-1 border-2 border-font-dark-grey rounded-[6px] cursor-pointer hover:border-yellow-main w-20 px-3 py-2">
        <div className="text-yellow-main">{row.original.review_count.positive}</div>
        <span>|</span>
        <div className="text-white">{row.original.review_count.neutral}</div>
        <span>|</span>
        <div className="text-[#FF0000]">{row.original.review_count.negative}</div>
      </div>
    ),
  },
];
