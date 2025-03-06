// eslint-disable-next-line import/order
import { Viewport } from "next";
import Script from "next/script";
import Head from "next/head";
import Providers from "@/app/providers/react-query";
import "@/shared/styles/globals.scss";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export const metadata = {
  title: "Мониторинг криптообменников онлайн - обмен криптовалюты по лучшим курсам | MoneySwap",
  description:
    "MoneySwap - удобный помощник для поиска обменников в любой точке мира. На нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "Мониторинг криптообменников онлайн - обмен криптовалюты по лучшим курсам | MoneySwap",
    description:
      "MoneySwap - удобный помощник для поиска обменников в любой точке мира. На нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов.",
    url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
    siteName: "MoneySwap",
    images: [
      {
        url: "/og_logo.svg",
        width: 400,
        height: 283,
        alt: "MoneySwap",
      },
    ],
    locale: "ru-RU",
    type: "website",
  },
  icons: {
    icon: "/favicon/favicon.ico",
  },
};
export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta
          name="google-site-verification"
          content="sPwXL6jSpXeyCa3nGMpepemssgj5Fjd4ZRpE9lofLfc"
        />
        <meta name="yandex-verification" content="7377d71acbace068" />
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-582D3SVQ');
          `}
        </Script>
        {/* Google Tag Manager */}
      </head>
      <Head>
        <link rel="icon" href="/public/favicon/favicon.ico" />
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            title="Google Tag Manager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-582D3SVQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager (noscript) */}
        <Providers>
          <Header />
          <main className="flex-grow max-w-[1400px] mx-[auto] w-full py-[40px] lg:pt-[130px] pt-[90px] mobile-xl:px-[25px] px-[15px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
