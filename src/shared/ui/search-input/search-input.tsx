"use client";

import { Search, X } from "lucide-react";
import { FC } from "react";
import { cn } from "@/shared/lib";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Строка поиска по названию в панелях фильтров разделов-рейтингов. */
export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Поиск по названию",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-12 w-full md:flex-1 md:min-w-[220px] px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey transition-colors focus-within:border-new-light-grey",
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // text-base на мобильном — иначе iOS зумит страницу при фокусе
        className="w-full min-w-0 bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Очистить поиск"
          className="shrink-0 text-light-gray transition-colors hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <Search className="w-4 h-4 text-light-gray shrink-0" />
      )}
    </div>
  );
};
