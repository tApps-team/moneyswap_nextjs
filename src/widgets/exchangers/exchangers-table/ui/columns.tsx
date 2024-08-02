"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { SortAsc } from "lucide-react";
import { Exchanger } from "@/entities/exchanger";
import { Button } from "@/shared/ui";

export type ExchangerTable = Exchanger;
// export const columns = (): ColumnDef<ExchangerTable>[] => {
//   return [
//     {
//       accessorKey: `${exchanger.name}`,
//       header: "Обменик",
//     },
//     {
//       accessorKey: exchanger.exchange_marker,
//       header: "Метки",
//     },
//     {
//       accessorKey: exchanger.valute_from,
//       header: "Отдаете",
//     },
//     {
//       accessorKey: exchanger.valute_to,
//       header: "Получаете",
//     },
//     {
//       accessorKey: `${exchanger.in_count}`,
//       header: "Сумма Обмена",
//     },
//     { accessorKey: `${exchanger.review_count.positive}`, header: "Отзывы" },
//   ];
// };
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
          <SortAsc className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "valute_from",
    header: "Отдаете",
    accessorFn: (valute_from) => `${valute_from.in_count} ${valute_from.valute_from}`,
  },
  {
    accessorKey: "valute_to",
    header: "Получаете",
    accessorFn: (valute_to) => `${valute_to.out_count} ${valute_to.valute_to}`,
  },
  {
    accessorKey: "in_count",
    header: "Сумма Обмена",
  },
  {
    header: "Отзывы",
    accessorFn: (review_count) =>
      `${review_count?.review_count?.positive}/${review_count.review_count.negative}`,
  },
];
