"use client";

import { FC, useEffect } from "react";
import { RatingSectionKey } from "@/shared/consts";
import { useYandexMetrika } from "@/shared/hooks";

interface AgentPageViewProps {
  serviceType: RatingSectionKey;
  slug: string;
}

/**
 * Отправляет цель «открыли карточку агента».
 *
 * Отдельный клиентский компонент нужен потому, что сами детальные страницы
 * серверные: там нет ни эффектов, ни доступа к window.
 */
export const AgentPageView: FC<AgentPageViewProps> = ({ serviceType, slug }) => {
  const { agentPageView } = useYandexMetrika();

  useEffect(() => {
    agentPageView(serviceType, slug);
    // Цель на одно открытие карточки: при смене агента шлём заново
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, slug]);

  return null;
};
