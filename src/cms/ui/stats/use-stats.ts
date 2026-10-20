"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CMS_BASE } from "@/cms/config/paths";

/** Общие фильтры статистики — в адресе: ссылкой можно поделиться и вернуться к тому же виду. */
export interface StatsQuery {
  from: string;
  to: string;
  device: string;
  source: string;
  section: string;
  staff: boolean;
  compare: boolean;
}

const mskToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
export const shiftDate = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export const todayMsk = mskToday;

export function useStatsQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo<StatsQuery>(() => {
    const to = params.get("to") || mskToday();
    return {
      from: params.get("from") || shiftDate(to, -29),
      to,
      device: params.get("device") ?? "",
      source: params.get("source") ?? "",
      section: params.get("section") ?? "",
      staff: params.get("staff") === "1",
      compare: params.get("compare") !== "0",
    };
  }, [params]);

  /** Обновить часть параметров, сохранив остальные (и свои у страницы, например сортировку таблицы). */
  const update = useCallback(
    (patch: Record<string, string | number | boolean | null | undefined>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "" || v === false) next.delete(k);
        else next.set(k, v === true ? "1" : String(v));
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  /** Строка общих фильтров — для ссылок между отчётами. */
  const shared = useMemo(() => {
    const keep = new URLSearchParams();
    for (const k of ["from", "to", "device", "source", "section", "staff", "compare"]) {
      const v = params.get(k);
      if (v) keep.set(k, v);
    }
    return keep.toString();
  }, [params]);

  return { query, update, params, shared };
}

export class StatsError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

async function fetchReport<T>(report: string, search: string): Promise<T> {
  const res = await fetch(`${CMS_BASE}/api/stats/${report}?${search}`, { cache: "no-store" });
  if (res.status === 401) {
    window.location.href = `${CMS_BASE}/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new StatsError(res.status, body?.message ?? `Ошибка ${res.status}`, body?.code);
  return body as T;
}

/**
 * Данные отчёта с общими фильтрами из адреса плюс свои параметры.
 * Пока грузится новый период, на экране остаются прежние цифры.
 */
export function useStats<T>(report: string, extra: Record<string, string | number | null | undefined> = {}, opts: { refetchInterval?: number; enabled?: boolean } = {}) {
  const { query } = useStatsQuery();
  const search = new URLSearchParams();
  search.set("from", query.from);
  search.set("to", query.to);
  if (query.device) search.set("device", query.device);
  if (query.source) search.set("source", query.source);
  if (query.section) search.set("section", query.section);
  if (query.staff) search.set("staff", "1");
  for (const [k, v] of Object.entries(extra)) if (v !== null && v !== undefined && v !== "") search.set(k, String(v));
  const key = search.toString();
  return useQuery({
    queryKey: ["cms", "stats", report, key],
    queryFn: () => fetchReport<T>(report, key),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchInterval: opts.refetchInterval,
    enabled: opts.enabled ?? true,
    retry: (count, err) => !(err instanceof StatsError && [401, 404, 503].includes(err.status)) && count < 2,
  });
}
