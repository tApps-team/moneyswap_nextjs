"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Clock, Calendar, Check, X } from "lucide-react";
import Link from "next/link";
import { Exchanger, AMLTooltip, ExchangeRatesDesktop } from "@/entities/exchanger";
import { defaultUserId, increaseLinkCount, increaseLinkCountPartners } from "@/entities/user";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";
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
          className="flex flex-col gap-0.5"
        >
          <p className="font-bold xl:text-lg text-base truncate max-w-[20vw]">{row.original?.name?.ru}</p>
          <AMLTooltip isHighRisk={row.original?.info?.high_aml ?? false} />
          {(row.original.exchange_marker === ExchangerMarker.partner || row.original.exchange_marker === ExchangerMarker.both) && (
            <span className="xl:text-[12px] text-[10px] font-medium inline-flex truncate gap-1 items-center justify-start leading-none">
              {(row.original.info?.weekdays?.time_from || row.original.info?.weekdays?.time_to) && (
                <div className="flex gap-1 items-center">
                  <Clock className="size-2.5" color="#B9B9B9" />
                  <p className="text-font-light-grey">
                    {row.original.info?.weekdays?.time_from} - {row.original.info?.weekdays?.time_to}
                  </p>
                </div>
              )}
              {Object.values(row.original.info?.working_days || {}).some((value) => value === true) && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-2.5" color="#B9B9B9" />
                  <div className="text-font-light-grey">
                    {(() => {
                      const daysMapping: Record<string, string> = {
                        'ПН': 'Пн',
                        'ВТ': 'Вт',
                        'СР': 'Ср',
                        'ЧТ': 'Чт',
                        'ПТ': 'Пт',
                        'СБ': 'Сб',
                        'ВС': 'Вс'
                      };
                      
                      const daysOrder = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
                      const workingDays = Object.entries(row.original.info?.working_days || {})
                        .filter(([_, isWorking]) => isWorking)
                        .map(([day]) => day);

                      // Если работают все 7 дней
                      if (workingDays.length === 7) {
                        return <span>Пн - Вс</span>;
                      }

                      let result = [];
                      let sequence = [];

                      for (let i = 0; i < daysOrder.length; i++) {
                        const day = daysOrder[i];
                        if (workingDays.includes(day)) {
                          sequence.push(day);
                        } else if (sequence.length > 0) {
                          if (sequence.length >= 3) {
                            result.push(`${daysMapping[sequence[0]]} - ${daysMapping[sequence[sequence.length - 1]]}`);
                          } else {
                            result.push(...sequence.map(d => daysMapping[d]));
                          }
                          sequence = [];
                        }
                      }

                      // Обработка последней последовательности
                      if (sequence.length > 0) {
                        if (sequence.length >= 3) {
                          result.push(`${daysMapping[sequence[0]]} - ${daysMapping[sequence[sequence.length - 1]]}`);
                        } else {
                          result.push(...sequence.map(d => daysMapping[d]));
                        }
                      }

                      return <span>{result.join(' ')}</span>;
                    })()}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1 text-font-light-grey">
                {row.original.info?.delivery ? (
                  <Check className="size-2.5" />
                ) : (
                  <X className="size-2.5" />
                )}
                <p>Доставка</p>
              </div>
              <div className="flex items-center gap-1 text-font-light-grey">
                {row.original.info?.office ? (
                  <Check className="size-2.5" />
                ) : (
                  <X className="size-2.5" />
                )}
                <p>Офис</p>
              </div>
            </span>
          )}
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
      <p className="text-lg font-bold leading-none uppercase truncate">Сумма обмена</p>
    ),
    enableHiding: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <div className="xl:text-sm text-xs font-light uppercase">от</div>
          <div className="xl:text-base text-sm text-yellow-main font-semibold">
            {row.original.min_amount}
          </div>
          {row.original.exchange_rates && <div className="ml-4">
          <ExchangeRatesDesktop
            rates={row.original.exchange_rates}
            valuteFrom={row.original.valute_from}
            valuteTo={row.original.valute_to}
          />
          </div>}
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
        <div className="relative grid grid-flow-col gap-2 items-center justify-between justify-items-start">
          {row.original.is_vip && (
            <div className="absolute xl:-top-6 -top-5 right-0">
              <div className="bg-yellow-main px-4 xl:py-1 py-0.5 rounded-[3px]">
                <span className="block text-center text-black uppercase xl:text-2xs text-[9px] font-bold leading-none truncate">
                  Лучшее предложение!
                </span>
              </div>
            </div>
          )}
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
        </div>
      );
    },
  },
];
