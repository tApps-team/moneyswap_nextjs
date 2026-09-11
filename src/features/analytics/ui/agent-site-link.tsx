"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";
import { RatingSectionKey } from "@/shared/consts";
import { useYandexMetrika } from "@/shared/hooks";

interface AgentSiteLinkProps {
  serviceType: RatingSectionKey;
  slug: string;
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Ссылка на сайт агента, отмечающая переход в Метрике.
 *
 * Подходит и кнопке «перейти», и ссылке промокода: с точки зрения цели это
 * один и тот же уход на внешний сервис.
 */
export const AgentSiteLink: FC<AgentSiteLinkProps> = ({
  serviceType,
  slug,
  href,
  className,
  children,
}) => {
  const { agentSiteClick } = useYandexMetrika();

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => agentSiteClick(serviceType, slug)}
    >
      {children}
    </Link>
  );
};
