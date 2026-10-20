import { Metadata } from "next";
import { HubPage } from "@/views/hub";
import { getSeoMeta } from "@/shared/api";
import { SECTION_GROUPS, getGroupSections } from "@/shared/consts";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";
const group = SECTION_GROUPS.find((item) => item.key === "cards")!;

export const revalidate = 300;

const DEFAULT_TITLE = "Карты — кредитные, дебетовые и виртуальные | MoneySwap";
const DEFAULT_DESCRIPTION =
  "Подборки карт на MoneySwap: льготный период и кредитный лимит, кэшбэк и процент на остаток, карты иностранных банков для оплаты за рубежом.";

export async function generateMetadata(): Promise<Metadata> {
  const seoMeta = await getSeoMeta({ page: pageTypes.cards_services });

  const title = seoMeta?.data?.[0]?.title || DEFAULT_TITLE;
  const description = seoMeta?.data?.[0]?.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.cards_services}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.cards_services}`,
    },
  };
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: group.title,
        url: `${baseUrl}${routes.cards_services}`,
        description: group.subtitle,
      },
      {
        "@type": "ItemList",
        name: group.title,
        itemListElement: getGroupSections(group).map((section, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: section.title,
          description: section.description,
          url: `${baseUrl}${section.href}`,
        })),
      },
    ],
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
      <HubPage groupKey="cards" seoPage={pageTypes.cards_services} />
    </>
  );
}
