import { SiteSectionKey } from "@/shared/consts";

/** Пара «подпись — значение» для компактной карточки. */
export interface PreviewField {
  label: string;
  value: string;
}

/** Чип с иконкой: страна, платёжная система, сервис. */
export interface PreviewTag {
  id: number | string;
  title: string;
  icon?: string | null;
}

/**
 * Общая форма карточки для подборок на главной.
 *
 * У сущностей разных разделов поля не совпадают (у ВЭД нет рейтинга, у карт есть
 * банк, у МФО — одобрение), поэтому перед показом они приводятся сюда адаптерами
 * из lib/adapters.ts. Это позволяет обойтись одной карточкой вместо девяти.
 */
export interface RatingPreview {
  /** Уникален между разделами: слаги в разных коллекциях могут совпадать. */
  id: string;
  /** Идентификатор во внешнем API — нужен там, где показатели догружаются отдельно. */
  entityId?: number;
  sectionKey: SiteSectionKey;
  name: string;
  /** Банк или площадка — вторая строка под названием. */
  subtitle?: string | null;
  logo: string | null;
  /** Внутренняя детальная страница. */
  href: string;
  isVip: boolean;
  rating: number | null;
  reviewsCount: number;
  /**
   * Показатели раздела — те же, что в таблице списка агентов.
   * Больше четырёх карточка не показывает: дальше она перестаёт читаться.
   */
  fields: PreviewField[];
  /** Строка чипов под показателями: страны, сервисы, платёжные системы. */
  tags?: PreviewTag[];
  tagsLabel?: string;
}
