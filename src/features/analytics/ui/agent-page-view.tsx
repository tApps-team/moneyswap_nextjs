"use client";

import { FC, useEffect } from "react";
import { setPageAgent } from "@/shared/analytics";
import { RatingSectionKey } from "@/shared/consts";
import { useYandexMetrika } from "@/shared/hooks";

interface AgentPageViewProps {
  serviceType: RatingSectionKey;
  slug: string;
  name?: string;
}

/**
 * Отправляет цель «открыли карточку агента» и сообщает собственной
 * статистике, чья это карточка: тогда кнопки «Перейти» на ней засчитываются
 * этому агенту, а в отчётах видно его название.
 *
 * Отдельный клиентский компонент нужен потому, что сами детальные страницы
 * серверные: там нет ни эффектов, ни доступа к window.
 */
export const AgentPageView: FC<AgentPageViewProps> = ({ serviceType, slug, name }) => {
  const { agentPageView } = useYandexMetrika();

  useEffect(() => {
    // Эффект ребёнка срабатывает раньше эффекта SiteTracker в layout —
    // просмотр страницы уйдёт уже с названием агента.
    setPageAgent({ section: serviceType, slug, name });
    agentPageView(serviceType, slug);
    return () => setPageAgent(null);
    // Цель на одно открытие карточки: при смене агента шлём заново
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, slug]);

  return null;
};
