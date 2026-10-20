import { Metadata } from "next";
import { HubPage } from "@/views/hub";
import { getSeoMeta } from "@/shared/api";
import { SECTION_GROUPS, getGroupSections } from "@/shared/consts";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";
const group = SECTION_GROUPS.find((item) => item.key === "abroad-services")!;

export const revalidate = 300;

const DEFAULT_TITLE = "Сервисы за рубежом — оплата подписок, игр и eSIM | MoneySwap";
const DEFAULT_DESCRIPTION =
  "Сервисы для оплаты зарубежных подписок и игр и провайдеры eSIM для поездок: условия, комиссии и отзывы в подборках MoneySwap.";

export async function generateMetadata(): Promise<Metadata> {
  const seoMeta = await getSeoMeta({ page: pageTypes.abroad_services });

  const title = seoMeta?.data?.[0]?.title || DEFAULT_TITLE;
  const description = seoMeta?.data?.[0]?.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${routes.abroad_services}`,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}${routes.abroad_services}`,
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
        url: `${baseUrl}${routes.abroad_services}`,
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
      <HubPage groupKey="abroad-services" seoPage={pageTypes.abroad_services} />
    </>
  );
}
