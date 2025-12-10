"use client";

import { ArrowDown, ArrowUp, Check, ChevronDown, X } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui";

export type MobileSortKey = "name" | "giveCurrency" | "getCurrency" | "minAmount" | "reviews";
export type MobileSortDirection = "asc" | "desc";
export type MobileSortState = {
  key: MobileSortKey | null;
  direction: MobileSortDirection;
};

type MobileExchangersSortingProps = {
  value: MobileSortState;
  onChange: (value: MobileSortState) => void;
  giveCurrency: string;
  getCurrency: string;
};

const sortOptions = (giveCurrency: string, getCurrency: string): { label: string; value: MobileSortKey }[] => [
  { label: "По названию", value: "name" },
  { label: `По курсу ${giveCurrency}`, value: "giveCurrency" },
  { label: `По курсу ${getCurrency}`, value: "getCurrency" },
  { label: "Минимальная сумма обмена", value: "minAmount" },
  { label: "По количеству отзывов", value: "reviews" },
];

export const MobileExchangersSorting = ({ value, onChange, giveCurrency, getCurrency }: MobileExchangersSortingProps) => {
  const options = sortOptions(giveCurrency, getCurrency);
  const activeOption = options.find((option) => option.value === value.key);
  const activeLabel = activeOption
    ? `${activeOption.label} ${value.direction === "asc" ? "↓" : "↑"}`
    : "Сортировать...";

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
          {options.map((option) => {
            const isActive = value.key === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                className="text-sm font-normal focus:bg-new-light-grey focus:text-white"
                onClick={() => {
                  if (isActive) {
                    onChange({
                      key: option.value,
                      direction: value.direction === "asc" ? "desc" : "asc",
                    });
                  } else {
                    onChange({ key: option.value, direction: "asc" });
                  }
                }}
              >
                <span className={`flex items-center justify-between w-full gap-2 ${isActive ? 'text-yellow-main' : 'text-white'}`}>
                  <span>{option.label}</span>
                  {isActive && (
                    <span className="flex items-center gap-1">
                      {value.direction === "asc" ? (
                        <ArrowDown className="h-4 w-4 text-yellow-main" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-yellow-main" />
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

