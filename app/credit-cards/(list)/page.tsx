import { Metadata } from "next";
import { CreditCardsPage } from "@/views/credit-cards";
import { getAllCreditCards, getCreditCardPage, stripHtmlToText } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

const DEFAULT_DESCRIPTION =
  "Кредитные карты российских банков: льготный период, кредитный лимит, ставка и стоимость обслуживания — сравнение условий на MoneySwap.";

function getPageDescription(headerContent: { paragraph?: { content?: string } }[] | undefined) {
  const paragraph = headerContent?.find(
    (item) => item && "paragraph" in item && item.paragraph?.content,
  );
  if (!paragraph?.paragraph?.content) {
    return DEFAULT_DESCRIPTION;
  }
  return stripHtmlToText(paragraph.paragraph.content).slice(0, 160);
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await getCreditCardPage();
  const title = page?.title ? `${page.title} | MoneySwap` : "Кредитные карты | MoneySwap";
  const description = getPageDescription(page?.header_content);

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.credit_cards}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.credit_cards}`,
    },
  };
}

export default async function Page() {
  const cards = await getAllCreditCards();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинг кредитных карт",
    description: DEFAULT_DESCRIPTION,
    itemListElement: cards.map((card, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: card.bank ? `${card.bank.title} — ${card.name}` : card.name,
      url: card.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs />
      <CreditCardsPage />
    </>
  );
}
