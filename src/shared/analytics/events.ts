/**
 * Формат событий между браузером и сборщиком `/api/collect`.
 * Ключи короткие: событий много, а `sendBeacon` ограничен ~64 КБ на пакет.
 */

export const EVENT_TYPES = [
  "page_view",
  "page_leave",
  "impression",
  "detail_click",
  "outbound_click",
  "external_click",
  "filter",
  "sort",
  "paginate",
  "goal",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface ClientEvent {
  /** Тип события. */
  t: EventType;
  /** Время в браузере, мс. Сервер сверяет его со своим и не верит дальше пары минут. */
  ts: number;
  /** Адрес страницы, на которой произошло событие, с query. */
  p: string;
  /** Раздел и slug агента, к которому относится событие. */
  s?: string;
  e?: string;
  /** Имя: название агента, фильтра, цели или ключ сортировки. */
  n?: string;
  /** Значение: вариант фильтра, направление сортировки, адрес ссылки, referrer. */
  v?: string;
  /** Откуда клик: list, detail, promo, similar, hub, home… */
  src?: string;
  /** Позиция карточки в списке, с единицы. */
  pos?: number;
  /** Числа: результаты фильтра, длительность, номер страницы, глубина прокрутки. */
  num?: number;
  num2?: number;
}

export interface CollectBatch {
  /** Анонимный id посетителя (браузера) и визита. */
  vid: string;
  sid: string;
  /** Браузер сотрудника (входил в CMS) — его визиты по умолчанию не попадают в отчёты. */
  st?: 1;
  events: ClientEvent[];
}

/** Источник клика по агенту: где стояла карточка или кнопка. */
export type ClickSource = "list" | "detail" | "promo" | "similar" | "hub" | "home" | "blog" | "other";
