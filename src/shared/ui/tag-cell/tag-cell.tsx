"use client";

import Image from "next/image";
import { FC } from "react";
import { cn } from "@/shared/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { ScrollArea } from "../scroll-area";

export interface TagItem {
  id: number;
  title: string;
  icon?: string;
  code?: string;
}

export type TagChipVariant = "circle" | "icon" | "flag" | "code";

interface TagCellProps {
  items: TagItem[];
  modalTitle: string;
  visibleCount?: number;
  chip?: TagChipVariant;
  className?: string;
}

export const TagCell: FC<TagCellProps> = ({
  items,
  modalTitle,
  visibleCount = 3,
  chip = "icon",
  className,
}) => {
  if (!items.length) {
    return <span className="text-light-gray text-sm">—</span>;
  }

  const visible = items.slice(0, visibleCount);
  const extra = items.length - visible.length;

  return (
    <Dialog>
      <DialogTrigger
        type="button"
        aria-label={`${modalTitle}: ${items.length}`}
        className={cn(
          "flex items-center gap-1.5 flex-wrap min-w-0 text-left rounded-lg cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-main/60",
          className,
        )}
      >
        {visible.map((item) => (
          <VisibleChip key={item.id} item={item} chip={chip} />
        ))}
        {extra > 0 && (
          <span className="flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-md bg-new-grey text-xs text-light-gray transition-colors hover:text-yellow-main">
            +{extra}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-5 bg-new-dark-grey border-none rounded-[20px] p-6 lg:p-8 w-[92vw] max-w-[640px]">
        <DialogTitle className="m-0 text-yellow-main uppercase text-lg lg:text-xl font-semibold">
          {modalTitle}
        </DialogTitle>
        <DialogDescription className="sr-only">{modalTitle}</DialogDescription>

        <ScrollArea className="max-h-[60dvh] -mr-3 pr-3 overflow-auto">
          <div className="flex flex-wrap gap-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-[10px] bg-new-grey px-3 py-2"
              >
                {item.icon && (
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                    className={cn(
                      "mobile-xl:w-5 mobile-xl:h-5 w-4 h-4 shrink-0 rounded-full",
                      chip === "flag" ? "object-cover" : "object-contain",
                    )}
                  />
                )}
                <span className="text-white mobile-xl:text-sm text-xs whitespace-nowrap">{item.title}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

function VisibleChip({ item, chip }: { item: TagItem; chip: TagChipVariant }) {
  if (chip === "code") {
    return (
      <span className="px-2 py-1 rounded-md bg-new-grey text-2xs text-light-gray uppercase">
        {item.code ?? item.title}
      </span>
    );
  }

  if (!item.icon) {
    return (
      <span className="px-2 py-1 rounded-md bg-new-grey text-2xs text-light-gray">{item.title}</span>
    );
  }

  return (
    <Image
      src={item.icon}
      alt={item.title}
      width={28}
      height={28}
      title={item.title}
      className={cn(
        "w-7 h-7 shrink-0 rounded-full",
        chip === "flag" ? "object-cover" : "object-contain",
      )}
    />
  );
}
