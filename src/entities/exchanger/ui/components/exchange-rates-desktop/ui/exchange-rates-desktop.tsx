"use client"

import { FC, useState } from "react";
import { ExchangeRatesIcon } from "@/shared/assets";
import { RoundValute, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui";
import { ExchangeRate } from "../../../../model/types/exchanger-type";

interface ExchangeRatesDesktopProps {
    rates: ExchangeRate[] | null;
    valuteFrom: string;
    valuteTo: string;
}

const smartRound = (num: number) => {
    const decimal = num.toString().split('.')[1];
    if (!decimal || decimal.length <= 3) return num;
    return Number(num.toFixed(3));
  };

export const ExchangeRatesDesktop:FC<ExchangeRatesDesktopProps> = ({
    rates,
    valuteFrom,
    valuteTo,
}) => {
    const [open, setOpen] = useState(false);
    if (!rates || rates.length === 0) return null;

    const sortedRates = [...rates].sort((a, b) => {
      const aCount = (!a.min_count || a.min_count === 0) ? 1 : a.min_count;
      const bCount = (!b.min_count || b.min_count === 0) ? 1 : b.min_count;
      return aCount - bCount;
    });

    return (
      <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          type="button"
          onClick={(e) => {setOpen(!open); e.preventDefault();}}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
            <ExchangeRatesIcon />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="shadow-lg !z-[20] bg-new-light-grey rounded-[10px] border-[1px] border-yellow-main lg:px-4 lg:py-3 px-2 py-2 border-none"
        >
    <div className="grid gap-0.5 gap-x-1 text-[10px] text-gray-400 w-full" style={{ gridTemplateColumns: 'max-content min-content max-content' }}>
      {sortedRates.map((rate, index) => {
        const minCount = (!rate.min_count || rate.min_count === 0) ? 1 : rate.min_count;
        const isInCountBigger = rate.in_count > rate.out_count;
        
        return (
          <div key={index} className="contents">
            <div className="flex items-end gap-1 min-w-0 leading-none whitespace-nowrap">
              {!isInCountBigger && <span className="flex items-end gap-1 text-[12px]">от <span className="text-gray-300 text-[13px] leading-none">{minCount}</span></span>}
              {isInCountBigger && <span className="text-gray-300 leading-none">
                <RoundValute value={smartRound(rate.in_count)} />
              </span>}
              <span className="truncate max-w-[18vw] inline-block text-[12px]">{valuteFrom}</span>
            </div>
            <span className="text-[12px] flex-shrink-0 leading-none">→</span>
            <div className="flex items-end gap-1 min-w-0 leading-none whitespace-nowrap">
              {isInCountBigger && <span className="flex items-end gap-1 text-[12px]">от <span className="text-gray-300 text-[13px] leading-none">{minCount}</span></span>}
              {!isInCountBigger && <span className="text-gray-300 leading-none text-[13px]">
                <RoundValute value={smartRound(rate.out_count)} />
              </span>}
              <span className="truncate max-w-[18vw] inline-block text-[12px]">{valuteTo}</span>
            </div>
          </div>
        );
      })}
    </div>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
    );
  };