import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getBlackList, getExchangerList, getSitemapDirections } from "@/entities/exchanger";
import { getAllArticles, getAllCategories, getAllTags } from "@/entities/strapi";
import { routes } from "@/shared/router";

export const dynamic = 'force-dynamic';

export const SitemapPage = async () => {
  // Выполняем все запросы параллельно
  const [directions, articles, categories, tags, exchangers, blackList] = await Promise.all([
    getSitemapDirections({ page: 1, element_on_page: 10 }),
    getAllArticles({ page: 1, elements: 1000 }),
    getAllCategories(),
    getAllTags(),
    getExchangerList(),
    getBlackList()
  ]);
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
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.blacklist}>
          Черный список
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.partners}>
          Для партнеров
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.contacts}>
          Контакты
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.help_article}>
          Помощь
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.blog}>
          Блог
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.about}>
          О нас
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.help_faq}>
          FAQ
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.terms}>
          Пользовательское соглашение
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.privacy}>
          Политика конфиденциальности
        </Link>
        <Link className="w-fit text-[#3498db] uppercase font-medium" href={routes.blacklist_terms}>
          Положение о Чёрном списке
        </Link>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Доступные обменные пункты</h2>

        {exchangers.map((exchanger) => (
          <Link
            key={exchanger.id}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.exchangers}/exchanger-${exchanger.id}`,
            }}
          >
            Обменный пункт {exchanger?.exchangerName.ru}
          </Link> 
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Черный список</h2>

        {blackList?.map((blackList) => (
          <Link
            key={blackList.id}
            className="w-fit text-[#3498db] uppercase font-medium"
            href={{
              pathname: `${routes.blacklist}/exchanger-${blackList.id}`,
            }}
          >
            Обменный пункт {blackList?.exchangerName?.ru}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase">Доступные направления обмена</h2>

        {directions?.directions?.map((direction) => (
          <Link
            key={
              direction.valute_to +
              direction.valute_from +
              direction.city +
              direction.direction_marker
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
        <Link
          className="w-fit text-yellow-main uppercase font-medium flex items-center gap-2"
          href={routes.directions}
        >
          Все направления обмена <ArrowUpRight className="size-4" />
        </Link>
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
