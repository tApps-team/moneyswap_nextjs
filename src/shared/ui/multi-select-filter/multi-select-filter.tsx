"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefCallback } from "react";
import { cn, useMediaQuery } from "@/shared/lib";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../drawer";

export interface MultiSelectOption {
  id: number;
  title: string;
  icon?: string;
  code?: string;
}

interface MultiSelectFilterProps {
  label: string;
  searchPlaceholder?: string;
  options: MultiSelectOption[];
  selected: number[];
  onChange: (ids: number[]) => void;
  /**
   * Как рисовать иконку элемента:
   * - "flag" — обрезка по кругу (object-cover);
   * - "icon" — логотип целиком (object-contain);
   * - "code" — плашка с кодом, если иконки нет.
   */
  variant?: "flag" | "code" | "icon";
}

/**
 * Мультивыбор с поиском внутри списка.
 * На десктопе — выпадающая панель, на мобильном — нижний drawer.
 */
export const MultiSelectFilter: FC<MultiSelectFilterProps> = ({
  label,
  searchPlaceholder = "Поиск",
  options,
  selected,
  onChange,
  variant = "flag",
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        (o.code ? o.code.toLowerCase().includes(query) : false),
    );
  }, [options, search]);

  // Закрытие десктопной панели по клику вне.
  useEffect(() => {
    if (!open || !isDesktop) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, isDesktop]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const toggle = (id: number) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const count = selected.length;

  // Автофокус на поиск при открытии десктопной панели (без autoFocus-пропа).
  const focusSearch: RefCallback<HTMLInputElement> = useCallback(
    (node) => {
      if (node && isDesktop) node.focus();
    },
    [isDesktop],
  );

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="flex items-center justify-between gap-3 w-full lg:w-auto lg:min-w-[240px] h-12 px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey text-sm text-white transition-colors hover:border-new-light-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-main/50"
    >
      <span className={cn("truncate", count ? "text-white" : "text-light-gray")}>{label}</span>
      <span className="flex items-center gap-2 shrink-0">
        {count > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-yellow-main text-black text-2xs font-semibold">
            {count}
          </span>
        )}
        <ChevronDown
          className={cn("w-4 h-4 text-light-gray transition-transform", open && "rotate-180")}
        />
      </span>
    </button>
  );

  const panelBody = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 h-11 px-3 rounded-[12px] border border-new-grey/60 bg-new-grey/20">
        <Search className="w-4 h-4 text-light-gray shrink-0" />
        <input
          ref={focusSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
        />
      </div>

      <div className="max-h-[45dvh] lg:max-h-[280px] overflow-y-auto -mr-1 pr-1 scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
        {filtered.length === 0 ? (
          <p className="text-center text-light-gray text-sm py-6">Ничего не найдено</p>
        ) : (
          <ul className="flex flex-col">
            {filtered.map((option) => {
              const checked = selected.includes(option.id);
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => toggle(option.id)}
                    className="flex items-center justify-between gap-3 w-full px-2 py-2.5 rounded-[10px] text-left transition-colors hover:bg-new-grey/40"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {variant === "code" && !option.icon ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-new-grey text-2xs text-light-gray uppercase shrink-0">
                          {option.code ?? option.title.charAt(0)}
                        </span>
                      ) : option.icon ? (
                        <Image
                          src={option.icon}
                          alt={option.title}
                          width={24}
                          height={24}
                          className={cn(
                            "w-6 h-6 rounded-full shrink-0",
                            variant === "flag" ? "object-cover" : "object-contain",
                          )}
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-new-grey shrink-0" />
                      )}
                      <span className="truncate text-sm text-white">{option.title}</span>
                    </span>

                    <span
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-[6px] border shrink-0 transition-colors",
                        checked
                          ? "border-yellow-main bg-yellow-main text-black"
                          : "border-new-light-grey",
                      )}
                    >
                      {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="w-full h-11 rounded-[12px] bg-yellow-main text-black text-sm font-medium transition-colors hover:bg-yellow-main/90"
      >
        Готово
      </button>
    </div>
  );

  return (
    <div ref={rootRef} className="relative w-full lg:w-auto">
      {trigger}

      {isDesktop && open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-full min-w-[300px] rounded-[16px] border border-new-grey/60 bg-new-dark-grey p-3 shadow-2xl">
          {panelBody}
        </div>
      )}

      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="border-new-grey/60 bg-new-dark-grey px-4 pb-6 pt-4">
            <DrawerTitle className="sr-only">{label}</DrawerTitle>
            <DrawerDescription className="sr-only">{label}</DrawerDescription>
            {panelBody}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
