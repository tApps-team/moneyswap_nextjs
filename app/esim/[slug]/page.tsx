import { Metadata } from "next";
import { notFound } from "next/navigation";
import { EsimServicePage } from "@/views/esim-service";
import { getEsimBySlug, getEsimRating, getEsims } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: service } = await getEsimBySlug({ slug: params.slug });

  if (!service) {
    return { title: "Сервис не найден | MoneySwap" };
  }

  const title = `Виртуальные сим-карты ${service.name} | MoneySwap`;
  const description = `${service.name}: eSIM от ${service.connection_price} ₽, трафик от ${service.internet_volume} ГБ. Отзывы и условия на MoneySwap.`;
  const canonical = `${baseUrl}${routes.esim}/${service.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MoneySwap",
      images: service.logo
        ? [{ url: service.logo, width: 400, height: 400, alt: service.name }]
        : [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  const [international, russian] = await Promise.all([
    getEsims({ marketType: "international", page: 1, pageSize: 1000 }),
    getEsims({ marketType: "russian", page: 1, pageSize: 1000 }),
  ]);

  const services = [...(international.data ?? []), ...(russian.data ?? [])];

  return services.map((service) => ({ slug: service.slug }));
}

export default async function Page({ params }: Props) {
  const { data: service } = await getEsimBySlug({ slug: params.slug });

  if (!service) {
    notFound();
  }

  const { ratingValue, reviewCount } = getEsimRating(service.reviews);
  const displayRating = ratingValue || service.rating || 0;
  const canonical = `${baseUrl}${routes.esim}/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: service.name,
    ...(service.logo && { image: service.logo }),
    description: `eSIM ${service.name}`,
    offers: {
      "@type": "Offer",
      price: service.connection_price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: canonical,
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: displayRating,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs esimServiceName={service.name} />
      <EsimServicePage slug={params.slug} />
    </>
  );
}
