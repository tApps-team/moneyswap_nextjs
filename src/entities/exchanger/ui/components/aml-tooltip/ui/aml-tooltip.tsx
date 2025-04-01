"use client"

import { useState } from "react";
import { AMLDesktopIcon, AMLMobileIcon } from "@/shared/assets";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui";

export const AMLTooltip = () => {
    const [open, setOpen] = useState(false);
    return (
      <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          type="button"
          className="!z-[15]"
          onClick={(e) => {setOpen(!open); e.preventDefault();}}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="lg:block hidden">
          <AMLDesktopIcon />
          </div>
          <div className="lg:hidden">
          <AMLMobileIcon />
          </div>
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