"use client";

import { Gift } from "lucide-react";
import Link from "next/link";
import { VedPromocode } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui";

interface VedPromoTooltipProps {
  slug: string;
  promocodes: VedPromocode[];
  className?: string;
}

/** Кнопка-подарок: при наведении показывает заголовок + описание промокодов. */
export function VedPromoTooltip({ slug, promocodes, className }: VedPromoTooltipProps) {
  if (!promocodes?.length) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${routes.ved_agents}/${slug}`}
            aria-label="Промокоды"
            className={cn(
              "flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-new-grey text-yellow-main hover:bg-yellow-main hover:text-black transition-colors",
              className,
            )}
          >
            <Gift className="w-4 h-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[260px] bg-new-dark-grey border-new-grey text-white p-0 shadow-lg"
        >
          <div className="grid gap-2.5 p-3">
            {promocodes.map((promo, index) => (
              <div key={`${promo.title}-${index}`} className="grid gap-1">
                <span className="text-yellow-main text-xs font-semibold leading-tight">
                  {promo.title}
                </span>
                {promo.description && (
                  <span className="text-light-gray text-2xs leading-snug">{promo.description}</span>
                )}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
