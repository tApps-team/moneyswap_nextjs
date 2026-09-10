import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentServicePage } from "@/views/payment-service";
import {
  formatCommission,
  getAllPaymentServices,
  getPaymentServiceBySlug,
} from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: service } = await getPaymentServiceBySlug({ slug: params.slug });

  if (!service) {
    return { title: "Сервис не найден | MoneySwap" };
  }

  const title = `${service.name} — оплата зарубежных сервисов | MoneySwap`;
  const description =
    service.description ??
    `${service.name}: комиссия ${formatCommission(service)}, способы оплаты и условия на MoneySwap.`;
  const canonical = `${baseUrl}${routes.payment_services}/${service.slug}`;

  return {
    title,
    description: description.slice(0, 300),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description: description.slice(0, 300),
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
  const services = await getAllPaymentServices();
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Page({ params }: Props) {
  const { data: service } = await getPaymentServiceBySlug({ slug: params.slug });

  if (!service) {
    notFound();
  }

  const canonical = `${baseUrl}${routes.payment_services}/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    ...(service.logo && { image: service.logo }),
    serviceType: "Оплата зарубежных сервисов",
    description: service.description ?? `Сервис оплаты ${service.name}`,
    url: canonical,
    ...(service.rating &&
      service.reviews_count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: service.rating,
          reviewCount: service.reviews_count,
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
      <Breadcrumbs paymentServiceName={service.name} />
      <PaymentServicePage slug={params.slug} />
    </>
  );
}
