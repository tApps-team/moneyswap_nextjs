"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { buildNavigation, CmsNavGroup } from "./navigation";
import { CmsAbility, createAbility } from "./permissions";
import { CmsSession } from "./types";

interface CmsSessionValue extends CmsSession {
  ability: CmsAbility;
  navigation: CmsNavGroup[];
}

const CmsSessionContext = createContext<CmsSessionValue | null>(null);

/**
 * Сессия приходит из серверного layout'а уже проверенной. Здесь она
 * дополняется тем, что нельзя передать с сервера (иконки меню — это функции).
 */
export function CmsSessionProvider({
  session,
  children,
}: {
  session: CmsSession;
  children: ReactNode;
}) {
  const value = useMemo<CmsSessionValue>(
    () => ({
      ...session,
      ability: createAbility(session.permissions),
      navigation: buildNavigation(session.contentTypes, session.permissions),
    }),
    [session],
  );
  return <CmsSessionContext.Provider value={value}>{children}</CmsSessionContext.Provider>;
}

export function useCmsSession(): CmsSessionValue {
  const value = useContext(CmsSessionContext);
  if (!value) throw new Error("useCmsSession вне CmsSessionProvider");
  return value;
}
