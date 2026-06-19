import { Metadata } from "next";
import { VirtualCardsPage } from "@/views/virtual-cards";
import { getVcPage, getVirtualCards, stripHtmlToText } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

export const dynamic = "force-dynamic";

function getVcPageDescription(headerContent: { paragraph?: { content?: string } }[] | undefined) {
  const paragraph = headerContent?.find(
    (item) => item && "paragraph" in item && item.paragraph?.content,
  );
  if (!paragraph?.paragraph?.content) {
    return "Рейтинг международных и российских виртуальных карт для оплаты зарубежных сервисов — комиссии, отзывы и промокоды на MoneySwap.";
  }
  return stripHtmlToText(paragraph.paragraph.content).slice(0, 160);
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: vcPage } = await getVcPage();
  const title = vcPage?.title
    ? `${vcPage.title} | MoneySwap`
    : "Рейтинг виртуальных карт | MoneySwap";
  const description = getVcPageDescription(vcPage?.header_content);

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.virtual_cards}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.virtual_cards}`,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [international, russian] = await Promise.all([
    getVirtualCards({ marketType: "international", noStore: true }),
    getVirtualCards({ marketType: "russian", noStore: true }),
  ]);

  const cards = [...(international.data ?? []), ...(russian.data ?? [])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинг виртуальных карт",
    description: "Международные и российские виртуальные карты для оплаты зарубежных сервисов",
    itemListElement: cards.map((card, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: card.name,
        url: `${baseUrl}${routes.vc_cards}/${card.slug}`,
      },
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
      <VirtualCardsPage searchParams={searchParams} />
    </>
  );
}
