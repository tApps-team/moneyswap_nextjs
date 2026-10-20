import { ClickSource } from "./events";

/**
 * Разметка карточек для статистики. Трекер сам находит размеченные карточки:
 * считает их показы и понимает, к какому агенту относится клик по кнопке
 * внутри — «Подробнее», «Перейти», логотип, промокод.
 *
 * `source` нужен, только когда место нельзя понять по странице: например,
 * блок «Похожие» на карточке агента. По умолчанию: список → list, хаб → hub,
 * главная → home, карточка агента → similar, статья → blog.
 */
export const agentMark = (section: string, slug: string, name?: string | null, source?: ClickSource) => ({
  "data-ms-agent": `${section}:${slug}`,
  ...(name ? { "data-ms-name": name } : {}),
  ...(source ? { "data-ms-src": source } : {}),
});

/**
 * Контейнер списка: позиции карточек считаются внутри него с учётом
 * страницы пагинации, а число результатов уходит с событиями фильтров.
 */
export const listMark = (opts: { offset?: number; total?: number }) => ({
  "data-ms-list": "",
  "data-ms-offset": String(opts.offset ?? 0),
  ...(opts.total !== undefined ? { "data-ms-total": String(opts.total) } : {}),
});

/** Кнопка ухода на сайт агента на его карточке: «Перейти», «Оформить». */
export const siteMark = { "data-ms-cta": "site" } as const;
/** Ссылка на сайт агента в блоке промокода: такой переход считается отдельно. */
export const promoMark = { "data-ms-cta": "promo" } as const;

/** Агент открытой карточки — для кнопок на ней, которые не лежат в размеченной карточке. */
let pageAgent: { section: string; slug: string; name?: string } | null = null;
export const setPageAgent = (agent: typeof pageAgent) => {
  pageAgent = agent;
};
export const getPageAgent = () => pageAgent;
