import Head from "next/head";
import "@/shared/styles/globals.scss";
import Providers from "@/app/providers/react-query";
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
        url: "/logo.png",
        width: 400,
        height: 200,
        alt: "MoneySwap",
      },
    ],
    locale: "ru-RU",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <Head>
        <link rel="icon" href="/public/favicon/favicon.ico" />
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-grow max-w-[1300px] mx-[auto] w-full py-[40px] pt-[130px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
