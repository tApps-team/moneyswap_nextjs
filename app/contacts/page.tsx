import { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";
import { routes } from "@/shared/router";
export default ContactsPage;

export const metadata: Metadata = {
  title: "MoneySwap — ваш проводник в мире обмена, переводов и платежных решений",
  description:
    "Узнайте больше о MoneySwap — платформе, где собраны лучшие криптообменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.contacts}`,
  },
  openGraph: {
    title: "MoneySwap — ваш проводник в мире обмена , переводов и платежных решений",
    description:
      "Узнайте больше о MoneySwap — платформе, где собраны лучшие криптообменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
    url: routes.contacts,
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
};
