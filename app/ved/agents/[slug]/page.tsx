import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VedAgentPage } from "@/views/ved-agent";
import { getVedAgentBySlug, getVedAgentRating, getVedAgents } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

function getVedAgentPath(slug: string) {
  return `${routes.ved_agents}/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: agent } = await getVedAgentBySlug({ slug: params.slug });

  if (!agent) {
    return { title: "Агент не найден | MoneySwap" };
  }

  const title = `${agent.name} — платежный агент | MoneySwap`;
  const description = `Международные платежи через ${agent.name}. Комиссия до ${agent.commission}%. Отзывы и условия на MoneySwap.`;
  const canonical = `${baseUrl}${getVedAgentPath(agent.slug)}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MoneySwap",
      images: [{ url: agent.logo || "/og_logo.svg", width: 400, height: 400, alt: agent.name }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  const agents = (await getVedAgents({ page: 1, pageSize: 1000 })).data ?? [];

  return agents.map((agent) => ({ slug: agent.slug }));
}

export default async function Page({ params }: Props) {
  const { data: agent } = await getVedAgentBySlug({ slug: params.slug });

  if (!agent) {
    notFound();
  }

  const { ratingValue, reviewCount } = getVedAgentRating(agent.reviews);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: agent.name,
    url: agent.url,
    image: agent.logo,
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
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
      <Breadcrumbs vedAgentName={agent.name} />
      <VedAgentPage slug={params.slug} />
    </>
  );
}
