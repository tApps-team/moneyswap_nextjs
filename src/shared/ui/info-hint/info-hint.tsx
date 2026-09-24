"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

interface InfoHintProps {
  /** Текст пояснения. */
  text: string;
  /** Что читает скринридер вместо иконки. */
  label?: string;
  className?: string;
}

/**
 * Иконка «i» с пояснением к параметру.
 *
 * Подсказка открывается и по наведению, и по клику: на тач-устройствах
 * hover не срабатывает, а Radix сам по тапу тултип не открывает.
 */
export function InfoHint({ text, label = "Пояснение", className }: InfoHintProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={(event) => {
              event.preventDefault();
              setOpen((prev) => !prev);
            }}
            className={cn(
              "inline-flex items-center justify-center shrink-0 text-light-gray hover:text-yellow-main transition-colors",
              className,
            )}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[260px] bg-new-dark-grey border-new-grey text-white text-xs leading-snug font-normal normal-case tracking-normal p-3 shadow-lg"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
