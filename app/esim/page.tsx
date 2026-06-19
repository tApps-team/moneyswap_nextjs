import { Metadata } from "next";
import { EsimPage } from "@/views/esim";
import { getEsimPage, getEsims, stripHtmlToText } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

export const dynamic = "force-dynamic";

function getEsimPageDescription(headerContent: { paragraph?: { content?: string } }[] | undefined) {
  const paragraph = headerContent?.find(
    (item) => item && "paragraph" in item && item.paragraph?.content,
  );
  if (!paragraph?.paragraph?.content) {
    return "Рейтинг международных и российских eSIM для поездок за границу — цены, трафик, страны и отзывы на MoneySwap.";
  }
  return stripHtmlToText(paragraph.paragraph.content).slice(0, 160);
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: esimPage } = await getEsimPage();
  const title = esimPage?.title
    ? `${esimPage.title} | MoneySwap`
    : "Рейтинг eSIM | MoneySwap";
  const description = getEsimPageDescription(esimPage?.header_content);

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.esim}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.esim}`,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [international, russian] = await Promise.all([
    getEsims({ marketType: "international", noStore: true }),
    getEsims({ marketType: "russian", noStore: true }),
  ]);

  const services = [...(international.data ?? []), ...(russian.data ?? [])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинг eSIM",
    description: "Международные и российские виртуальные SIM-карты для поездок",
    itemListElement: services.map((service, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: service.name,
        url: `${baseUrl}${routes.esim}/${service.slug}`,
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
      <EsimPage searchParams={searchParams} />
    </>
  );
}
