"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefCallback } from "react";
import { cn, useMediaQuery } from "@/shared/lib";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../drawer";

/** id — число для справочников Strapi и строка для enum-значений (категория карты, тип лимита). */
export interface MultiSelectOption<T extends string | number = number> {
  id: T;
  title: string;
  icon?: string;
  code?: string;
}

interface MultiSelectFilterProps<T extends string | number = number> {
  label: string;
  searchPlaceholder?: string;
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (ids: T[]) => void;
  /**
   * Как рисовать иконку элемента:
   * - "flag" — обрезка по кругу (object-cover);
   * - "icon" — логотип целиком (object-contain);
   * - "code" — плашка с кодом, если иконки нет.
   */
  variant?: "flag" | "code" | "icon";
  /** Скрыть строку поиска — для коротких списков вроде «Категория карты». */
  searchable?: boolean;
}

/**
 * Мультивыбор с поиском внутри списка.
 * На десктопе — выпадающая панель, на мобильном — нижний drawer.
 */
export function MultiSelectFilter<T extends string | number = number>({
  label,
  searchPlaceholder = "Поиск",
  options,
  selected,
  onChange,
  variant = "flag",
  searchable = true,
}: MultiSelectFilterProps<T>) {
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

  const toggle = (id: T) => {
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

  /** inDrawer: на мобильном высоту задаёт drawer, поэтому список тянется, а не диктует высоту. */
  const renderPanel = (inDrawer = false) => (
    <div className={cn("flex flex-col gap-3", inDrawer && "flex-1 min-h-0")}>
      {searchable && (
        <div className="flex items-center gap-2 h-11 shrink-0 px-3 rounded-[12px] border border-new-grey/60 bg-new-grey/20">
          <Search className="w-4 h-4 text-light-gray shrink-0" />
          <input
            ref={focusSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
          />
        </div>
      )}

      {/* svh, а не dvh: динамическая единица пересчитывается на появление клавиатуры и дёргает высоту. */}
      <div
        className={cn(
          "overflow-y-auto -mr-1 pr-1 scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent",
          inDrawer ? "flex-1 min-h-0" : "max-h-[45svh] lg:max-h-[280px]",
        )}
      >
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
        className="w-full h-11 shrink-0 rounded-[12px] bg-yellow-main text-black text-sm font-medium transition-colors hover:bg-yellow-main/90"
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
          {renderPanel()}
        </div>
      )}

      {/* repositionInputs={false} — иначе vaul на каждый resize от клавиатуры
          растягивает drawer по высоте visualViewport и уводит его вверх. */}
      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
          <DrawerContent className="min-h-[70svh] max-h-[90svh] border-new-grey/60 bg-new-dark-grey px-4 pb-6 pt-4">
            <DrawerTitle className="sr-only">{label}</DrawerTitle>
            <DrawerDescription className="sr-only">{label}</DrawerDescription>
            {renderPanel(true)}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
