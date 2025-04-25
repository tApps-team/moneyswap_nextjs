import { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";
import { routes } from "@/shared/router";
export default ContactsPage;

export const metadata: Metadata = {
  title: "Связь с командой MoneySwap",
  description:
    "У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена? Мы всегда на связи и готовы помочь!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.contacts}`,
  },
  openGraph: {
    title: "Связь с командой MoneySwap",
    description:
      "У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена? Мы всегда на связи и готовы помочь!",
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