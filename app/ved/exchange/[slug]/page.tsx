import { Metadata } from "next";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Обмен ВЭД | MoneySwap`,
    description: "Раздел обмена ВЭД — скоро",
    metadataBase: new URL(baseUrl),
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${baseUrl}${routes.ved_exchange}/${params.slug}`,
    },
  };
}

export default function Page({ params }: Props) {
  return (
    <>
      <Breadcrumbs />
      <section className="min-h-[40vh] flex items-center justify-center bg-new-dark-grey rounded-[15px] p-10">
        <p className="text-light-gray text-center">
          Раздел обмена «{params.slug}» в разработке
        </p>
      </section>
    </>
  );
}
