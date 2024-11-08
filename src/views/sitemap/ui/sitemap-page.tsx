import Link from "next/link";
import { getExchangerList, getSitemapDirections } from "@/entities/exchanger";
import { getAllArticles, getAllCategories, getAllTags } from "@/entities/strapi";
import { routes } from "@/shared/router";

export const SitemapPage = async () => {
  const directions = await getSitemapDirections();
  const articles = await getAllArticles({ page: 1 });
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const exchangers = await getExchangerList();
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-medium text-2xl uppercase">Карта сайта</h1>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Основные разделы</h2>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.home}>
          Обмен криптовалюты
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.exchangers}>
          Список обменников
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.partners}>
          Для партнеров
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.help}>
          Помощь
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.blog}>
          Блог
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.about}>
          О нас
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.help}>
          FAQ
        </Link>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Доступные обменные пункты</h2>

        {exchangers.map((exchanger) => (
          <Link
            key={exchanger.id + exchanger.exchange_marker}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.exchangers}/exchanger-${exchanger.id}`,
              query: { "exchanger-marker": exchanger.exchange_marker },
            }}
          >
            Обменный пункт {exchanger.exchangerName}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Доступные направления обмена</h2>

        {directions.map((direction) => (
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
              query: { city: direction.city },
            }}
          >
            Обмен {direction.valute_from} на {direction.valute_to}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Статьи</h2>

        {articles?.data?.map((article) => (
          <Link
            key={article?.id}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.blog}${routes.article}/${article?.url_name}`,
            }}
          >
            {article?.preview?.title}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Категории статей</h2>

        {categories?.data?.categories?.map((category) => (
          <Link
            key={category?.id}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.blog}${routes.category}/${category?.category}`,
            }}
          >
            {category?.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Теги статей</h2>

        {tags?.data?.tags?.map((tag) => (
          <Link
            key={tag?.id}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.blog}${routes.tag}/${tag?.tag}`,
            }}
          >
            {tag?.name}
          </Link>
        ))}
      </div>
    </section>
  );
};
