"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CryptoExchanger } from "@/entities/exchanger";
import { Country } from "@/entities/location";
import { Review } from "@/shared/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";

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
    cell: ({ row }) => <p className="uppercase">{row.getValue("exchangerName")}</p>,
  },
  {
    accessorKey: "workStatus",
    header: "СТАТУС",
    cell: ({ row }) => {
      const workStatus = row.original.workStatus ? "Активен" : "Не активен";
      return <p className="uppercase">{workStatus}</p>;
    },
  },
  {
    accessorKey: "reserves",
    header: "РЕЗЕРВЫ",
    cell: ({ row }) => <p className="uppercase">{row.original.reserves}</p>,
  },
  {
    accessorKey: "courses",
    header: "КУРСОВ",
    cell: ({ row }) => <p className="uppercase">{row.original.courses}</p>,
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
      <div className="flex gap-1">
        <div className="text-yellow-main">{row.original.reviews.positive}</div>
        <span>/</span>
        <div className="text-red-600">{row.original.reviews.negative}</div>
      </div>
    ),
  },
  {
    //TODO refactor as href
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <Link
        // as={{
        //   pathname: `/crypto-exchangers/exchanger-${row.original.id}`,
        // }}
        href={{
          pathname: `/crypto-exchangers/exchanger-${row.original.id}`,
          query: { "exchanger-marker": row.original.exchange_marker },
        }}
      >
        <button>ПОДРОБНЕЕ</button>
      </Link>
    ),
  },
];
