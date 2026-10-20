"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { compactFilters, FilterState } from "./filters";

export const PAGE_SIZES = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

export interface ListState {
  page: number;
  pageSize: number;
  /** «field:ASC» / «field:DESC» или пусто — порядок Strapi по умолчанию. */
  sort: string;
  q: string;
  filters: FilterState;
}

function parseFilters(raw: string | null): FilterState {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FilterState) : {};
  } catch {
    return {};
  }
}

/**
 * Состояние списка живёт в URL: ссылкой на отфильтрованный вид можно
 * поделиться, а кнопка «Назад» из карточки записи возвращает к тому же виду.
 */
export function useListState(defaultSort = "updatedAt:DESC") {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const state = useMemo<ListState>(() => {
    const size = Number(params.get("size"));
    return {
      page: Math.max(1, Number(params.get("page")) || 1),
      pageSize: PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE,
      sort: params.get("sort") ?? defaultSort,
      q: params.get("q") ?? "",
      filters: parseFilters(params.get("f")),
    };
  }, [params, defaultSort]);

  const update = useCallback(
    (patch: Partial<ListState>) => {
      const next = { ...state, ...patch };
      // Любое изменение условий выборки возвращает на первую страницу.
      if (!("page" in patch)) next.page = 1;

      const search = new URLSearchParams();
      if (next.page > 1) search.set("page", String(next.page));
      if (next.pageSize !== DEFAULT_PAGE_SIZE) search.set("size", String(next.pageSize));
      if (next.sort && next.sort !== defaultSort) search.set("sort", next.sort);
      if (next.q) search.set("q", next.q);
      const filters = compactFilters(next.filters);
      if (Object.keys(filters).length) search.set("f", JSON.stringify(filters));

      const qs = search.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [state, router, pathname, defaultSort],
  );

  return { state, update };
}
