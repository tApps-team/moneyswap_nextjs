// eslint-disable-next-line import/order
import { Viewport } from "next";
import Script from "next/script";
import Head from "next/head";
import Providers from "@/app/providers/react-query";
import "@/shared/styles/globals.scss";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/shared/ui";

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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-96x96.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#191C25'
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
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
        <meta name="msapplication-TileColor" content="#191C25" />
        <meta name="theme-color" content="#191C25" />
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
        {/* Яндекс.Метрика */}
        {/* <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            // Инициализация после загрузки скрипта
            (function() {
              if (typeof window !== 'undefined' && window.ym) {
                window.ym(100210634, "init", {
                  defer: true,
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true
                });
              } else {
                // Если ym еще не загружен, ждем
                setTimeout(arguments.callee, 100);
              }
            })();
          `}
        </Script> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MoneySwap",
              "url": process.env.NEXT_PUBLIC_SITE_BASE_URL,
              "logo": "/og_logo.svg",
              "description": "MoneySwap - удобный помощник для поиска обменников в любой точке мира",
              "sameAs": [
                "https://t.me/moneyswap",
                "https://t.me/moneyswap_robot",
                "https://vc.ru/u/3979537-moneyswap",
                "https://dzen.ru/moneyswap",
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "url": "https://t.me/moneyswap_support",
                  "availableLanguage": ["Russian", "English"]
                },
                {
                  "@type": "ContactPoint",
                  "contactType": "partnership",
                  "email": "exchange@moneyswap.online",
                  "availableLanguage": ["Russian", "English"]
                }
              ],
              "foundingDate": "2024",
            }).replace(/</g, '\\u003c')
          }}
        />
      </head>
      <Head>
        <link rel="icon" href="/public/favicon/favicon.ico" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <NextTopLoader 
          color="#F6FF5F"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
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
        <Toaster />
      </body>
    </html>
  );
}