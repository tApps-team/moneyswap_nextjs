import { Metadata } from "next";
import { CreditsPage } from "@/views/credits";
import { getAllBankCredits, getBankCreditPage, stripHtmlToText } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

const DEFAULT_DESCRIPTION =
  "Потребительские кредиты российских банков: сумма, срок, ставка и полная стоимость кредита — сравнение предложений на MoneySwap.";

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
  const { data: page } = await getBankCreditPage();
  const title = page?.title ? `${page.title} | MoneySwap` : "Кредиты | MoneySwap";
  const description = getPageDescription(page?.header_content);

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.credits}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.credits}`,
    },
  };
}

export default async function Page() {
  const credits = await getAllBankCredits();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинг потребительских кредитов",
    description: DEFAULT_DESCRIPTION,
    itemListElement: credits.map((credit, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: credit.bank ? `${credit.bank.title} — ${credit.name}` : credit.name,
      url: `${baseUrl}${routes.credits}/${credit.slug}`,
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
      <CreditsPage />
    </>
  );
}
