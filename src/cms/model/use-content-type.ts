"use client";

import { useMemo } from "react";
import { contentTypeTitle } from "./navigation";
import { useCmsSession } from "./session-context";
import { CmsContentType } from "./types";

/**
 * Тип контента по сегменту URL (singularName). Возвращает null, если такого
 * типа нет или пользователю он не виден — страница покажет «не найдено».
 */
export function useContentTypeBySlug(slug: string, kind: CmsContentType["kind"]) {
  const { contentTypes, navigation } = useCmsSession();
  return useMemo(() => {
    const ct = contentTypes.find((c) => c.kind === kind && c.info.singularName === slug);
    if (!ct) return null;
    const visible = navigation.some((g) => g.items.some((i) => i.uid === ct.uid));
    return visible ? { contentType: ct, title: contentTypeTitle(ct) } : null;
  }, [contentTypes, navigation, slug, kind]);
}
