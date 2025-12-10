"use client";

import { ArrowDown, ArrowUp, Check, ChevronDown, X } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui";

export type CryptoMobileSortKey = "name" | "status" | "reserves" | "courses" | "reviews";
export type CryptoMobileSortDirection = "asc" | "desc";

export type CryptoMobileSort = {
  key: CryptoMobileSortKey | null;
  direction: CryptoMobileSortDirection;
};

type MobileCryptoSortingProps = {
  value: CryptoMobileSort;
  onChange: (sort: CryptoMobileSort) => void;
};

const sortOptions: { label: string; value: CryptoMobileSortKey }[] = [
  { label: "По названию", value: "name" },
  { label: "По статусу", value: "status" },
  { label: "По резервам", value: "reserves" },
  { label: "По количеству направлений", value: "courses" },
  { label: "По отзывам", value: "reviews" },
];

export const MobileCryptoSorting = ({ value, onChange }: MobileCryptoSortingProps) => {
  const activeOption = sortOptions.find((option) => option.value === value.key);
  const activeLabel = activeOption
    ? `${activeOption.label} ${value.direction === "asc" ? "↑" : "↓"}`
    : "Сортировать...";

  const handleOptionClick = (optionValue: CryptoMobileSortKey) => {
    if (value.key === optionValue) {
      // Переключаем направление при повторном клике
      onChange({
        key: optionValue,
        direction: value.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Выбираем новую опцию с направлением по умолчанию (asc)
      onChange({
        key: optionValue,
        direction: "asc",
      });
    }
  };

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-new-light-grey text-white hover:bg-new-light-grey hover:text-white border-0 focus:border-1 focus:border-font-dark-grey"
          >
            <span className="text-sm font-normal">{activeLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-new-grey text-white border-font-dark-grey"
        >
          {sortOptions.map((option) => {
            const isActive = value.key === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                className="text-sm font-normal focus:bg-new-light-grey focus:text-white"
                onClick={() => handleOptionClick(option.value)}
              >
                <span className={`flex items-center justify-between w-full gap-2 ${isActive ? 'text-yellow-main' : 'text-white'}`}>
                  <span>{option.label}</span>
                  {isActive && (
                    <span className="flex items-center gap-1">
                      {value.direction === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-yellow-main" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-yellow-main" />
                      )}
                      <Check className="h-4 w-4 text-yellow-main" />
                    </span>
                  )}
                </span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuItem
            className="text-sm font-normal focus:bg-new-light-grey focus:text-white text-white"
            onClick={() => onChange({ key: null, direction: "asc" })}
          >
            <span className="flex items-center justify-between w-full gap-2 text-red-600">
              <span>Очистить</span>
              <X className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

