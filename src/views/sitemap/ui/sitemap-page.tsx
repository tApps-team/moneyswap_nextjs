import Link from "next/link";
import { getSitemapDirections } from "@/entities/exchanger";
import { routes } from "@/shared/router";

export const SitemapPage = async () => {
  const directions = await getSitemapDirections();
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-medium text-2xl">Карта сайта</h1>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-lg">Основные разделы</h2>
        <Link className="w-fit" href={routes.home}>
          Обмен криптовалюты
        </Link>
        <Link className="w-fit" href={routes.exchangers}>
          Список обменников
        </Link>
        <Link className="w-fit" href={routes.partners}>
          Для партнеров
        </Link>
        <Link className="w-fit" href={routes.help}>
          Помощь
        </Link>
        <Link className="w-fit" href={routes.blog}>
          Блог
        </Link>
        <Link className="w-fit" href={routes.about}>
          О нас
        </Link>
        <Link className="w-fit" href={routes.help}>
          FAQ
        </Link>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-lg">Доступные направления обмена</h2>

        {directions.map((direction) => (
          <Link
            key={
              direction.valute_to +
              direction.valute_from +
              direction.city +
              direction.exchange_marker
            }
            className="w-fit"
            href={{
              pathname: `/${direction.valute_from}-to-${direction.valute_to}`,
              query: { city: direction.city },
            }}
          >
            Обмен {direction.valute_from} на {direction.valute_to}
          </Link>
        ))}
      </div>
    </section>
  );
};
