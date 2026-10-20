import { notFound } from "next/navigation";

/**
 * Ловушка для несуществующих URL.
 *
 * У сайта и CMS (/strapi) разные корневые layout'ы (route groups `(site)` и
 * `(cms)`), поэтому общего app/layout.tsx нет и app/not-found.tsx не может быть
 * глобальным. Без этой страницы неизвестный адрес получил бы голую 404 Next.js
 * без шапки и подвала; так он рендерит (site)/not-found.tsx внутри сайта.
 */
export default function CatchAllNotFound() {
  notFound();
}
