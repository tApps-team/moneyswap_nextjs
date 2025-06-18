"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Маппинг сегментов на читаемые названия
const segmentNameMap: Record<string, string> = {
  "": "Главная",
  "exchange": "Обмен",
  "blog": "Блог",
  "category": "Категория",
  "tag": "Тег",
  "article": "Статья",
  "help": "Помощь",
  "crypto-exchangers": "Криптообменники",
  "for-partners": "Партнёрам",
  "contacts": "Контакты",
};

export const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{
    href: "/",
    label: segmentNameMap[""] || "Главная",
  }];
  let path = "";
  segments.forEach((seg, i) => {
    path += `/${seg}`;
    let label = segmentNameMap[seg] || decodeURIComponent(seg);
    // Особые случаи
    if (segments[0] === "blog" && seg === "category" && segments[i + 1]) {
      label = `Категория: ${decodeURIComponent(segments[i + 1])}`;
    }
    if (segments[0] === "blog" && seg === "tag" && segments[i + 1]) {
      label = `Тег: ${decodeURIComponent(segments[i + 1])}`;
    }
    if (segments[0] === "blog" && seg === "article" && segments[i + 1]) {
      label = `Статья: ${decodeURIComponent(segments[i + 1])}`;
    }
    if (segments[0] === "crypto-exchangers" && i === 1) {
      label = `Обменник: ${decodeURIComponent(seg)}`;
    }
    if (seg === "exchange" && segments[i + 1]) {
      label = `Обмен: ${decodeURIComponent(segments[i + 1])}`;
    }
    // Не добавлять дублирующие сегменты
    if (breadcrumbs.find(b => b.href === path)) return;
    breadcrumbs.push({ href: path, label });
  });
  return breadcrumbs;
}

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  // SEO: schema.org BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.label,
      "item": `${process.env.NEXT_PUBLIC_SITE_BASE_URL || ''}${b.href}`,
    })),
  };

  return (
    <nav aria-label="Хлебные крошки" className="mb-4 -mt-4">
      <ol className="flex flex-wrap gap-1 mobile-xl:text-base font-normal text-xs text-gray-400">
        {breadcrumbs.map((b, i) => (
          <li key={b.href} className="flex items-center">
            {i !== 0 && <span className="mr-1">/</span>}
            {i < breadcrumbs.length - 1 ? (
              <Link href={b.href} className="hover:underline">{b.label}</Link>
            ) : (
              <span className="text-white">{b.label}</span>
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