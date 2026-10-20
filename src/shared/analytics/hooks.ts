"use client";

import { useEffect, useRef } from "react";
import { track } from "./tracker";

/**
 * Смена сортировки списка. Сравниваем с прошлым значением, а не «пропускаем
 * первый запуск»: в StrictMode эффект при открытии срабатывает дважды.
 */
export function useTrackSort(sort: { key: string; dir: string } | null) {
  const current = sort ? `${sort.key}:${sort.dir}` : "";
  const prev = useRef(current);
  useEffect(() => {
    if (prev.current === current) return;
    prev.current = current;
    track({ t: "sort", n: sort?.key ?? "reset", v: sort?.dir });
  }, [current, sort?.key, sort?.dir]);
}
