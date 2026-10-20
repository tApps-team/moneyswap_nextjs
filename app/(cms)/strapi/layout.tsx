import { Metadata, Viewport } from "next";
// Свои глобальные стили, без сайтового globals.scss — подробности в самом файле.
import "@/cms/styles/cms.scss";
import { CmsProviders } from "@/cms/ui/providers";
import { Toaster } from "@/shared/ui";

/**
 * Корневой layout CMS — отдельный от сайта (route group `(cms)`).
 *
 * Здесь намеренно нет шапки и подвала сайта, GTM, JSON-LD организации и
 * верификации поисковиков: CMS не должна попадать в индекс, а работа
 * контент-менеджеров не должна считаться визитами на сайт.
 */
export const metadata: Metadata = {
  title: { default: "MoneySwap CMS", template: "%s — MoneySwap CMS" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }] },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  themeColor: "#191C25",
};

export default function CmsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/*
          Шрифт — ссылкой, как и на сайте (shared/styles/fonts.scss), а не через
          next/font: тот скачивает шрифт при сборке и падает на текущем формате
          ответов Google Fonts, что сломало бы сборку в CI.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- отдельный корневой layout CMS */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <CmsProviders>{children}</CmsProviders>
        <Toaster />
      </body>
    </html>
  );
}
