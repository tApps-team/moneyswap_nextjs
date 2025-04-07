"use client"

import { useState } from "react";
import { AMLDesktopIcon, AMLMobileIcon } from "@/shared/assets";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui";

interface AMLTooltipProps {
  isHighRisk: boolean;
}

export const AMLTooltip = ({ isHighRisk }: AMLTooltipProps) => {
    const [open, setOpen] = useState(false);
    return (
      <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          type="button"
          className="!z-[15] rounded-[3px] bg-new-light-grey py-0.5 px-1 w-fit"
          onClick={(e) => {setOpen(!open); e.preventDefault();}}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <p className="mobile:text-xs text-[10px] text-mainColor whitespace-nowrap">
            AML risk: <span className={`${isHighRisk ? 'text-red-500' : 'text-green-500'} font-medium`}>
              {isHighRisk ? 'HIGH' : 'LOW'}
            </span>
          </p>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="shadow-lg !z-[20] bg-new-light-grey rounded-[8px] lg:px-4 lg:py-3 px-2 py-2 border-none w-[70vw] max-w-[200px]"
        >
          <p className="leading-3 mobile-xl:text-xs text-[10px] text-white text-wrap">Этот обменник имеет
высокие показатели AML-риска.
Рекомендуем проявлять
осторожность при обмене</p>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
    );
  };