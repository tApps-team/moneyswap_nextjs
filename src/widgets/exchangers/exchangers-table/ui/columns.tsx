"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Exchanger } from "@/entities/exchanger";
import { defaultUserId, increaseLinkCount, increaseLinkCountPartners } from "@/entities/user";
import { routes } from "@/shared/router";
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
    cell: ({ row }) => {
      const handleClick = (exchanger: Exchanger) => {
        if (defaultUserId) {
          const increaseincreaseLinkCountReq = {
            user_id: defaultUserId,
            exchange_id: exchanger?.exchange_id,
            exchange_direction_id: exchanger?.exchange_direction_id,
          };
          exchanger?.direction_marker
            ? increaseLinkCountPartners({
                ...increaseincreaseLinkCountReq,
                direction_marker: exchanger?.direction_marker,
              })
            : increaseLinkCount({
                ...increaseincreaseLinkCountReq,
                exchange_marker: exchanger?.exchange_marker,
              });
        }
      };
      return (
        <Link
          onClick={() => handleClick(row?.original)}
          href={row.original.partner_link || "/"}
          target="_blank"
        >
          <p className="font-bold xl:text-lg text-base">{row.original?.name?.ru}</p>
        </Link>
      );
    },
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
      const isBankomats =
        (row.original?.info &&
          row.original.info.bankomats &&
          row.original?.info?.bankomats.length > 0) ||
        false;
      return (
        <div className={`${isBankomats && "relative w-full"}`}>
          <div
            className={`${isBankomats} grid grid-flow-row justify-start items-start justify-items-start`}
          >
            <div className="xl:text-lg text-base text-yellow-main font-bold truncate max-w-[200px]">
              {row.original.out_count}
            </div>
            <div className="xl:text-base text-sm font-semibold truncate max-w-[200px]">
              {row.original.valute_to}
            </div>
          </div>
          {isBankomats && (
            <div className="absolute mt-1 top-0 right-0 justify-start flex flex-wrap flex-row gap-x-1 gap-y-0.5 max-w-[calc(100vw_*_0.075)]">
              {row.original?.info?.bankomats?.map((bank) => (
                <div
                  key={bank?.id}
                  className="rounded-full overflow-hidden w-[18px] h-[18px] flex-shrink-0 cursor-pointer"
                >
                  <img src={bank?.icon} alt="icon" className="w[18px]4 h-[18px]" />
                </div>
              ))}
            </div>
          )}
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
          <div className="xl:text-sm text-xs font-light uppercase">от</div>
          <div className="xl:text-base text-sm text-yellow-main font-semibold">
            {row.original.min_amount}
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="xl:text-sm text-xs font-light uppercase">до</div>
          <div className="xl:text-base text-sm text-yellow-main font-semibold">
            {row.original.max_amount}
          </div>
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
    cell: ({ row }) => {
      return (
        <Link
          href={`${routes.exchangers}/exchanger-${row?.original?.exchange_id}?exchanger-marker=${row?.original?.exchange_marker}`}
          className="w-fit xl:text-base text-sm flex gap-1 border-2 border-font-dark-grey rounded-[6px] cursor-pointer hover:border-yellow-main px-3 py-2"
        >
          <div className="text-yellow-main">{row.original.review_count.positive}</div>
          <span>|</span>
          <div className="text-white">{row.original.review_count.neutral}</div>
          <span>|</span>
          <div className="text-[#FF0000]">{row.original.review_count.negative}</div>
        </Link>
      );
    },
  },
];
