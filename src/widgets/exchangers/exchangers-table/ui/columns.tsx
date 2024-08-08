"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Exchanger } from "@/entities/exchanger";

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
    cell: ({ row }) => <p className="font-semibold text-base">{row.original?.name?.ru}</p>,
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
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <div className="text-[#f6ff5f] text-base">{row.original.in_count}</div>
        <div className="font-normal">{row.original.valute_from}</div>
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <div className="text-[#f6ff5f] text-base">{row.original.out_count}</div>
        <div>{row.original.valute_to}</div>
      </div>
    ),
  },
  {
    accessorKey: "in_count",
    header: "Сумма Обмена",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <div className="text-xs">ОТ</div>
          <div>{row.original.min_amount}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-xs">ДО</div>
          <div>{row.original.max_amount}</div>
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
      <div className="flex gap-1">
        <div className="text-[#f6ff5f]">{row.original.review_count.positive}</div>
        <span>/</span>
        <div className="text-red-600">{row.original.review_count.negative}</div>
      </div>
    ),
  },
];
