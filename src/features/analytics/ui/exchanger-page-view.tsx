"use client";

import { FC, useEffect } from "react";
import { setPageAgent } from "@/shared/analytics";

/**
 * Сообщает статистике, чья это страница обменника: «Перейти на сайт» на ней
 * засчитывается этому обменнику, а в отчётах видно его название.
 * Цель Метрики здесь не нужна — обменники в ней учитываются отдельно.
 */
export const ExchangerPageView: FC<{ id: number; name?: string }> = ({ id, name }) => {
  useEffect(() => {
    setPageAgent({ section: "exchangers", slug: String(id), name });
    return () => setPageAgent(null);
  }, [id, name]);
  return null;
};
