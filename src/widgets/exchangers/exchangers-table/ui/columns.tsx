"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronUpIcon, SortAsc } from "lucide-react";
import { Exchanger } from "@/entities/exchanger";
import { Button } from "@/shared/ui";

export type ExchangerTable = Exchanger;

export const columns: ColumnDef<ExchangerTable>[] = [
  {
    accessorKey: `name.ru`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Обменник
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorFn: (exchanger) => exchanger.in_count,
    id: "Give",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ОТДАЕТЕ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    sortDescFirst: false,
    sortUndefined: "last",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <div className="text-[#f6ff5f]">{row.original.in_count}</div>
        <div>{row.original.valute_from}</div>
      </div>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.out_count,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ПОЛУЧАЕТЕ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    id: "Get",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <div className="text-[#f6ff5f]">{row.original.out_count}</div>
        <div>{row.original.valute_to}</div>
      </div>
    ),
  },
  {
    accessorKey: "in_count",
    header: "Сумма Обмена",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex gap-1">
          <div>ОТ</div>
          <div>{row.original.min_amount}</div>
        </div>
        <div className="flex gap-1">
          <div>ДО</div>
          <div>{row.original.max_amount}</div>
        </div>
      </div>
    ),
  },
  {
    accessorFn: (exchanger) => exchanger.review_count.positive,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ОТЗЫВЫ
          {column.getIsSorted() === "asc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-2 h-4 w-4" />
          )}
        </Button>
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
