import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DirectionsPagination } from "@/widgets/sitemap";
import { getSitemapDirections } from "@/entities/exchanger";
import { routes } from "@/shared/router";

export const SitemapDirectionsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const element_on_page = 100;
  const directionsData = await getSitemapDirections({ page, element_on_page });

  return (
    <section className="flex flex-col gap-6">
      <Link
        className="w-fit text-yellow-main font-medium flex items-center gap-2"
        href={routes.sitemap}
      >
        <ArrowLeft className="size-4" />
        Вернуться
      </Link>
      <h1 className="font-medium text-base mobile:text-2xl uppercase">Активные направления обмена</h1>
      {directionsData && <DirectionsPagination directionsData={directionsData} />}
      <div className="flex flex-col gap-2 text-sm">
        {directionsData?.directions?.map((direction) => (
          <Link
            key={
              direction.valute_to +
              direction.valute_from +
              direction.city +
              direction.exchange_marker
            }
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.exchange}/${direction.valute_from}-to-${direction.valute_to}`,
              query: direction.city ? { city: direction.city } : {},
            }}
          >
            Обмен {direction.valute_from} на {direction.valute_to}
          </Link>
        ))}
      </div>
      {directionsData && <DirectionsPagination directionsData={directionsData} />}
    </section>
  );
};
