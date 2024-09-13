"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Country } from "@/entities/location";
import { Review } from "@/shared/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";

export type CryptoTableColumns = {
  info: {
    name: string;
    age: string;
    amountReserves: number;
    country: Omit<Country, "cities">;
  };
  exchangerName: string;
  workStatus: string;
  reserves: number;
  courses: number;
  reviews: Review;
  id?: number;
  url?: string;
};

export const cryptoColumns: ColumnDef<CryptoTableColumns>[] = [
  // {
  //   id: "info",
  //   accessorFn: (info) => info.info,
  //   header: () => {
  //     return <ChevronDown />;
  //   },
  //   cell: ({ row }) => (
  //     <HoverCard>
  //       <HoverCardTrigger asChild>
  //         <InfoIcon width={32} height={32} />
  //       </HoverCardTrigger>
  //       <HoverCardContent
  //         align="start"
  //         side="right"
  //         className="w-52 rounded-2xl bg-[#2d2d2d] text-white uppercase p-3"
  //       >
  //         <p>{row.original.info.name}</p>
  //         <hr className="mx-[-0.75rem]" />
  //         <p>Возраст: {row.original.info.age}</p>
  //         <p>Сумма резервов: {row.original.info.amountReserves}</p>
  //         <div>
  //           <p>Страна: {row.original.info.country.name.ru}</p>
  //           {/* <Image
  //               src={row.original.info.country.icon_url}
  //               alt={`country ${row.original.info.country.name.ru}`}
  //               width={10}
  //               height={10}
  //             /> */}
  //         </div>
  //       </HoverCardContent>
  //     </HoverCard>
  //   ),
  // },
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
    cell: ({ row }) => <p className="uppercase">{row.original.workStatus}</p>,
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
        <div className="text-[#f6ff5f]">{row.original.reviews.positive}</div>
        <span>/</span>
        <div className="text-red-600">{row.original.reviews.negative}</div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <Link href={`/crypto-exchangers/exchanger-${row.id}`}>
        <button>ПОДРОБНЕЕ</button>
      </Link>
    ),
  },
];
