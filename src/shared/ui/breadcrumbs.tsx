"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Маппинг сегментов на читаемые названия
const segmentNameMap: Record<string, string> = {
  "": "Главная",
  "exchange": "Обмен",
  "blog": "Блог",
  "help": "Помощь",
  "crypto-exchangers": "Обменники",
  "blacklist": "Черный список",
  "for-partners": "Партнёрам",
  "contacts": "Контакты",
  "about": "О нас",
};

export interface BreadcrumbsProps {
  pathname?: string;
  title?: string;
  categoryName?: string;
  tagName?: string;
  exchangerName?: string;
  exchange?: string;
}

export function getSmartBreadcrumbs({
  pathname,
  title,
  categoryName,
  tagName,
  exchangerName,
  exchange,
}: BreadcrumbsProps & { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ href: "/", label: segmentNameMap[""] || "Главная" }];

  // /exchange/[slug]
  if (segments[0] === "exchange" && segments[1]) {
    breadcrumbs.push({ href: `/exchange/${segments[1]}`, label: exchange || decodeURIComponent(segments[1]) });
    return breadcrumbs;
  }

  // /crypto-exchangers/[slug]
  if (segments[0] === "crypto-exchangers" && segments[1]) {
    breadcrumbs.push({ href: `/crypto-exchangers`, label: segmentNameMap["crypto-exchangers"] });
    breadcrumbs.push({ href: `/crypto-exchangers/${segments[1]}`, label: exchangerName || decodeURIComponent(segments[1]) });
    return breadcrumbs;
  }

  // /blacklist/[slug]
  if (segments[0] === "blacklist" && segments[1]) {
    breadcrumbs.push({ href: `/blacklist`, label: segmentNameMap["blacklist"] });
    breadcrumbs.push({ href: `/blacklist/${segments[1]}`, label: exchangerName || decodeURIComponent(segments[1]) });
    return breadcrumbs;
  }

  // /blog/article/[slug]
  if (segments[0] === "blog" && segments[1] === "article" && segments[2]) {
    breadcrumbs.push({ href: `/blog`, label: segmentNameMap["blog"] });
    breadcrumbs.push({ href: `/blog/article/${segments[2]}`, label: title || decodeURIComponent(segments[2]) });
    return breadcrumbs;
  }

  // /blog/category/[slug]
  if (segments[0] === "blog" && segments[1] === "category" && segments[2]) {
    breadcrumbs.push({ href: `/blog`, label: segmentNameMap["blog"] });
    breadcrumbs.push({ href: `/blog/category/${segments[2]}`, label: categoryName || decodeURIComponent(segments[2]) });
    return breadcrumbs;
  }

  // /blog/tag/[slug]
  if (segments[0] === "blog" && segments[1] === "tag" && segments[2]) {
    breadcrumbs.push({ href: `/blog`, label: segmentNameMap["blog"] });
    breadcrumbs.push({ href: `/blog/tag/${segments[2]}`, label: tagName || decodeURIComponent(segments[2]) });
    return breadcrumbs;
  }

  // /blog
  if (segments[0] === "blog" && segments.length === 1) {
    breadcrumbs.push({ href: `/blog`, label: segmentNameMap["blog"] });
    return breadcrumbs;
  }

  // /help, /contacts, /for-partners
  if (segments.length === 1 && segmentNameMap[segments[0]]) {
    breadcrumbs.push({ href: `/${segments[0]}`, label: segmentNameMap[segments[0]] });
    return breadcrumbs;
  }

  // fallback: просто строим по сегментам
  let path = "";
  segments.forEach((seg) => {
    path += `/${seg}`;
    breadcrumbs.push({ href: path, label: segmentNameMap[seg] || decodeURIComponent(seg) });
  });
  return breadcrumbs;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const pathnameFromHook = usePathname();
  const pathname = props.pathname || pathnameFromHook;
  const breadcrumbs = getSmartBreadcrumbs({ ...props, pathname });

  // SEO: schema.org BreadcrumbList
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || '';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.label,
      "item": `${baseUrl}${b.href}`,
    })),
  };

  return (
    <nav aria-label="Хлебные крошки" className="mb-4 lg:-mt-4 mt-0 mobile-xl:bg-new-dark-grey bg-transparent w-fit mobile-xl:px-4 mobile-xl:py-3 p-0 mobile-xl:rounded-[10px] uppercase mobile-xl:text-font-light-grey text-font-dark-grey font-semibold max:text-base xl:text-sm mobile:text-xs text-2xs truncate" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="flex flex-wrap gap-1 justify-start justify-items-start items-center">
        {breadcrumbs.map((b, i) => (
          <li key={b.href} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {i !== 0 && <span className="mr-1" aria-hidden="true">/</span>}
            {i < breadcrumbs.length - 1 ? (
              <Link href={b.href} className="hover:underline" itemProp="item">
                <span itemProp="name">{b.label}</span>
                <meta itemProp="position" content={String(i + 1)} />
              </Link>
            ) : (
              <span className="text-white" itemProp="name">
                {b.label}
                <meta itemProp="position" content={String(i + 1)} />
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
};