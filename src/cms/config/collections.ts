import {
  CreditCard,
  FileText,
  Folder,
  Globe,
  Hash,
  HelpCircle,
  Landmark,
  LayoutTemplate,
  ListTree,
  LucideIcon,
  MessageSquare,
  Newspaper,
  Search,
  Smartphone,
  Sparkles,
  Wallet,
  WalletCards,
  Coins,
} from "lucide-react";

export type CmsGroupKey = "agents" | "dictionaries" | "reviews" | "pages" | "blog" | "other";

export const CMS_GROUPS: { key: CmsGroupKey; title: string }[] = [
  { key: "agents", title: "Рейтинги" },
  { key: "dictionaries", title: "Справочники" },
  { key: "reviews", title: "Отзывы" },
  { key: "pages", title: "Страницы разделов" },
  { key: "blog", title: "Блог" },
  { key: "other", title: "Сайт: FAQ, SEO, страницы" },
];

export interface CmsCollectionConfig {
  /** Название в меню и заголовках. */
  title: string;
  group: CmsGroupKey;
  icon?: LucideIcon;
  /** Колонки списка по умолчанию, по порядку. Пользователь может включить и другие. */
  columns?: string[];
  /** Фильтры списка. По умолчанию — enum, boolean и связи со справочниками. */
  filters?: string[];
  /** Подписи полей, отличные от общего словаря labels.ts. */
  fieldLabels?: Record<string, string>;
  /** Страница записи на сайте, {поле} подставляется из записи: «/ved/agents/{slug}». */
  sitePath?: string;
  /** Поле адреса и поле, из которого его генерировать. По умолчанию slug ← главное поле. */
  slug?: { field: string; from: string };
  /** Подписи вариантов enum именно этой коллекции (поле type у FAQ и подборок — разное). */
  enumLabels?: Record<string, Record<string, string>>;
  /**
   * Обратные связи (mappedBy), которые редактируются в форме как обычное поле.
   * Так сохраняется сама запись — и её вебхук ревалидирует её страницу.
   */
  editableInverse?: string[];
}

/**
 * Поля, которые CMS не показывает нигде. Галочки «прикрепить все» остаются
 * в Strapi, но здесь их заменяет массовый выбор связей — понятнее и точнее.
 */
export const isHiddenField = (name: string) => /^attach_all_/.test(name);

const DICT_COLUMNS = ["icon", "title", "slug", "publishedAt", "updatedAt"];
const REVIEW_LABELS = { rating: "Оценка" };

/**
 * Русские названия и группы типов контента.
 *
 * Конфиг только уточняет: меню строится по правам пользователя, и тип,
 * которого здесь нет, всё равно появится — под именем из схемы Strapi
 * в группе «Прочее».
 */
export const CMS_COLLECTIONS: Record<string, CmsCollectionConfig> = {
  // Рейтинги
  "api::ved-agent.ved-agent": {
    sitePath: "/ved/agents/{slug}",
    title: "ВЭД-агенты",
    group: "agents",
    icon: Globe,
    columns: [
      "logo",
      "name",
      "commission",
      "countries",
      "currencies",
      "is_vip",
      "publishedAt",
      "updatedAt",
    ],
  },
  "api::virtual-card.virtual-card": {
    sitePath: "/virtual-cards/cards/{slug}",
    title: "Виртуальные карты",
    group: "agents",
    icon: CreditCard,
    columns: [
      "logo",
      "name",
      "market_type",
      "issuance_cost",
      "platforms",
      "countries",
      "is_vip",
      "publishedAt",
    ],
  },
  "api::e-sim.e-sim": {
    sitePath: "/esim/{slug}",
    title: "eSIM",
    group: "agents",
    icon: Smartphone,
    columns: [
      "logo",
      "name",
      "market_type",
      "connection_price",
      "validity_period",
      "countries",
      "rating",
      "publishedAt",
    ],
  },
  "api::payment-service.payment-service": {
    sitePath: "/payment-services/{slug}",
    title: "Оплата сервисов",
    group: "agents",
    icon: Wallet,
    columns: [
      "logo",
      "name",
      "commission",
      "platforms",
      "countries",
      "rating",
      "is_vip",
      "publishedAt",
    ],
  },
  "api::debit-card.debit-card": {
    sitePath: "/debit-cards/{slug}",
    title: "Дебетовые карты",
    group: "agents",
    icon: WalletCards,
    columns: [
      "logo",
      "name",
      "bank",
      "card_category",
      "cashback",
      "rating",
      "is_vip",
      "publishedAt",
    ],
  },
  "api::credit-card.credit-card": {
    sitePath: "/credit-cards/{slug}",
    title: "Кредитные карты",
    group: "agents",
    icon: CreditCard,
    columns: [
      "logo",
      "name",
      "bank",
      "card_category",
      "grace_period_days",
      "rate",
      "is_vip",
      "publishedAt",
    ],
  },
  "api::bank-credit.bank-credit": {
    sitePath: "/credits/{slug}",
    title: "Кредиты",
    group: "agents",
    icon: Landmark,
    columns: ["logo", "name", "bank", "rate", "amount_to", "term_months", "is_vip", "publishedAt"],
  },
  "api::microloan.microloan": {
    sitePath: "/microloans/{slug}",
    title: "Микрозаймы",
    group: "agents",
    icon: Coins,
    columns: [
      "logo",
      "name",
      "approval",
      "amount_max",
      "term_max_days",
      "rate",
      "is_vip",
      "publishedAt",
    ],
  },

  // Справочники
  "api::ved-country.ved-country": {
    title: "Страны",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::ved-currency.ved-currency": {
    title: "Валюты",
    group: "dictionaries",
    icon: ListTree,
    columns: ["icon", "code", "title", "publishedAt", "updatedAt"],
  },
  "api::vc-platform.vc-platform": {
    title: "Платформы",
    group: "dictionaries",
    icon: ListTree,
    columns: ["icon", "title", "kind", "slug", "publishedAt"],
  },
  "api::vc-payment-system.vc-payment-system": {
    title: "Платёжные системы (вирт. карты)",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::esim-payment-system.esim-payment-system": {
    title: "Платёжные системы",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::ved-label.ved-label": {
    title: "Метки ВЭД",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::esim-label.esim-label": {
    title: "Метки eSIM",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::bank.bank": {
    title: "Банки",
    group: "dictionaries",
    icon: ListTree,
    columns: ["logo", "title", "url", "publishedAt"],
  },
  "api::card-feature.card-feature": {
    title: "Особенности карт",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::card-bonus.card-bonus": {
    title: "Бонусы карт",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::ml-issue-channel.ml-issue-channel": {
    title: "Способы получения займа",
    group: "dictionaries",
    icon: ListTree,
    columns: DICT_COLUMNS,
  },
  "api::ml-collection.ml-collection": {
    title: "Подборки МФО",
    group: "dictionaries",
    icon: ListTree,
    columns: ["title", "slug", "publishedAt", "updatedAt"],
  },

  // Отзывы
  "api::ved-review.ved-review": {
    title: "Отзывы ВЭД",
    group: "reviews",
    icon: MessageSquare,
    columns: ["username", "rating", "agent", "review_date", "publishedAt"],
    fieldLabels: REVIEW_LABELS,
  },
  "api::vc-review.vc-review": {
    title: "Отзывы виртуальных карт",
    group: "reviews",
    icon: MessageSquare,
    columns: ["username", "rating", "virtual_card", "review_date", "publishedAt"],
    fieldLabels: REVIEW_LABELS,
  },
  "api::esim-review.esim-review": {
    title: "Отзывы eSIM",
    group: "reviews",
    icon: MessageSquare,
    columns: ["username", "rating", "e_sim", "review_date", "publishedAt"],
    fieldLabels: REVIEW_LABELS,
  },

  // Страницы разделов
  "api::ved-page.ved-page": { title: "Раздел ВЭД", group: "pages", icon: LayoutTemplate },
  "api::vc-page.vc-page": {
    title: "Раздел виртуальных карт",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::esim-page.esim-page": { title: "Раздел eSIM", group: "pages", icon: LayoutTemplate },
  "api::payment-service-page.payment-service-page": {
    title: "Раздел оплаты сервисов",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::debit-card-page.debit-card-page": {
    title: "Раздел дебетовых карт",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::credit-card-page.credit-card-page": {
    title: "Раздел кредитных карт",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::bank-credit-page.bank-credit-page": {
    title: "Раздел кредитов",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::microloan-page.microloan-page": {
    title: "Раздел микрозаймов",
    group: "pages",
    icon: LayoutTemplate,
  },
  "api::crypto-exchangers-page.crypto-exchangers-page": {
    title: "Раздел обменников",
    group: "pages",
    icon: LayoutTemplate,
  },

  // Блог, FAQ и SEO — роль Manager/Editor
  "api::blog-article.blog-article": {
    title: "Статьи",
    group: "blog",
    icon: Newspaper,
    columns: ["preview_image", "preview_title", "categories", "tags", "publishedAt", "updatedAt"],
    filters: ["publishedAt", "categories", "tags"],
    sitePath: "/blog/article/{url_name}",
    slug: { field: "url_name", from: "article_title" },
    // Теги хранятся на стороне тега, но редактируются в статье — как в штатной
    // админке. Сохраняется статья, и вебхук обновляет её страницу.
    editableInverse: ["tags"],
  },
  "api::blog-article-category.blog-article-category": {
    title: "Категории",
    group: "blog",
    icon: Folder,
    columns: ["category_name_ru", "category", "publishedAt", "updatedAt"],
    sitePath: "/blog/category/{category}",
    slug: { field: "category", from: "category_name_ru" },
  },
  "api::blog-article-tag.blog-article-tag": {
    title: "Теги",
    group: "blog",
    icon: Hash,
    columns: ["tag_name_ru", "tag", "publishedAt", "updatedAt"],
    sitePath: "/blog/tag/{tag}",
    slug: { field: "tag", from: "tag_name_ru" },
  },
  "api::blog-article-topic.blog-article-topic": {
    title: "Подборки статей",
    group: "blog",
    icon: Sparkles,
    columns: ["name_ru", "type", "publishedAt", "updatedAt"],
    fieldLabels: { type: "Блок на странице блога" },
    enumLabels: {
      type: {
        main_topics: "Главные темы",
        readers_choice: "Выбор читателей",
        platform_recommended: "MoneySwap рекомендует",
      },
    },
  },
  "api::main-faq.main-faq": {
    title: "FAQ",
    group: "other",
    icon: HelpCircle,
    columns: ["question", "type", "publishedAt", "updatedAt"],
    filters: ["publishedAt", "type"],
    fieldLabels: { type: "Раздел" },
    enumLabels: {
      type: {
        basic: "Общие вопросы",
        from_users: "Вопросы от пользователей",
        cash: "Наличный обмен",
        noncash: "Безналичный обмен",
        for_partners: "Вопросы от партнёров",
      },
    },
  },
  "api::seo-meta-block.seo-meta-block": {
    title: "SEO: мета-теги",
    group: "other",
    icon: Search,
    columns: ["page", "title", "description", "publishedAt"],
    filters: ["publishedAt", "page"],
    fieldLabels: { title: "Title", description: "Description" },
  },
  "api::seo-texts-block.seo-texts-block": {
    title: "SEO: тексты",
    group: "other",
    icon: Search,
    columns: ["page", "publishedAt", "updatedAt"],
    filters: ["publishedAt", "page"],
  },
  "api::about-us.about-us": { title: "О проекте", group: "other", icon: FileText },
  "api::for-partner.for-partner": { title: "Партнёрам", group: "other", icon: FileText },
  "api::help-page-article.help-page-article": { title: "Помощь", group: "other", icon: FileText },
};
