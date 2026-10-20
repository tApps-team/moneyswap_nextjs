/**
 * Русские подписи полей и значений enum.
 *
 * Общий словарь по имени поля: одно и то же поле (name, countries, rating…)
 * в разных коллекциях называется одинаково. Если в конкретной коллекции нужно
 * иначе — переопределение в `fieldLabels` её конфига (collections.ts).
 */
export const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  name: "Название",
  title: "Название",
  slug: "Адрес (slug)",
  url: "Ссылка",
  code: "Код",
  is_vip: "VIP",
  logo: "Логотип",
  icon: "Иконка",
  description: "Описание",
  rating: "Рейтинг",
  reviews_count: "Отзывов",
  promocodes: "Промокоды",
  about: "Подробное описание",
  publishedAt: "Статус",
  createdAt: "Создано",
  updatedAt: "Изменено",

  // ВЭД
  commission: "Комиссия",
  limit_from: "Лимит от",
  limit_to: "Лимит до",
  labels: "Метки",
  countries: "Страны",
  currencies: "Валюты",
  reviews: "Отзывы",

  // Виртуальные карты, eSIM, оплата сервисов
  market_type: "Рынок",
  issuance_cost: "Стоимость выпуска",
  maintenance_info: "Обслуживание",
  topup_commission: "Комиссия пополнения",
  platforms: "Платформы",
  payment_systems: "Платёжные системы",
  internet_volume: "Объём интернета, ГБ",
  connection_price: "Цена подключения",
  validity_period: "Срок действия",
  internet_sharing: "Раздача интернета",
  calls: "Звонки",
  top_up: "Пополнение",
  commission_from: "Комиссия от, %",
  kind: "Тип",

  // Карты, кредиты
  bank: "Банк",
  service_cost: "Обслуживание",
  transfer_limit: "Лимит переводов",
  cashback: "Кэшбэк",
  cashback_description: "Условия кэшбэка",
  percent_on_balance: "% на остаток",
  card_category: "Категория",
  city: "Город",
  features: "Особенности",
  bonuses: "Бонусы",
  grace_period: "Льготный период",
  grace_period_days: "Льготный период, дней",
  credit_limit: "Кредитный лимит",
  credit_limit_value: "Кредитный лимит, ₽",
  rate: "Ставка",
  psk: "ПСК",
  amount: "Сумма",
  amount_from: "Сумма от",
  amount_to: "Сумма до",
  term: "Срок",
  term_months: "Срок, мес.",

  // Микрозаймы
  approval: "Одобрение",
  amount_min: "Сумма от",
  amount_max: "Сумма до",
  term_min_days: "Срок от, дней",
  term_max_days: "Срок до, дней",
  loan_amount_type: "Группа суммы",
  loan_term_type: "Группа срока",
  first_loan_type: "Первый займ",
  verification_status: "Проверка условий",
  loan_limit_type: "Тип лимита",
  loan_duration_type: "Тип срока",
  issue_channels: "Получение денег",
  collections: "Подборки",

  // Отзывы
  username: "Автор",
  text: "Текст",
  review_date: "Дата отзыва",
  agent: "Агент",
  virtual_card: "Виртуальная карта",
  e_sim: "eSIM",

  // Страницы разделов
  header_content: "Текст в шапке раздела",
  footer_content: "Текст в подвале раздела",

  // Обратные связи справочников
  agents: "ВЭД-агенты",
  virtual_cards: "Виртуальные карты",
  e_sims: "eSIM",
  payment_services: "Оплата сервисов",
  debit_cards: "Дебетовые карты",
  credit_cards: "Кредитные карты",
  bank_credits: "Кредиты",
  microloans: "Микрозаймы",

  // Блог
  article_title: "Заголовок статьи",
  article_description: "Вступление",
  url_name: "Адрес статьи",
  preview_title: "Заголовок",
  preview_description: "Описание в карточке",
  preview_image: "Картинка карточки",
  categories: "Категории",
  tags: "Теги",
  dynamic_content: "Содержание",
  meta_title: "SEO: title",
  meta_description: "SEO: description",
  category_name_ru: "Название",
  category: "Адрес категории",
  tag_name_ru: "Название",
  tag: "Адрес тега",
  name_ru: "Название",
  articles: "Статьи",

  // FAQ и SEO
  question: "Вопрос",
  answer: "Ответ",
  page: "Страница",
  keywords: "Ключевые слова",
  header_title: "Заголовок вверху страницы",
  header_description: "Текст вверху страницы",
  footer_title: "Заголовок внизу страницы",
  footer_description: "Текст внизу страницы",
};

/** Значения enum по имени поля. */
export const ENUM_LABELS: Record<string, Record<string, string>> = {
  market_type: { international: "Международный", russian: "Российский" },
  validity_period: {
    from_1_day: "от 1 дня",
    from_3_days: "от 3 дней",
    from_5_days: "от 5 дней",
    from_7_days: "от 7 дней",
    from_10_days: "от 10 дней",
    from_30_days: "от 30 дней",
    from_6_months: "от 6 месяцев",
    from_1_year: "от 1 года",
    from_2_years: "от 2 лет",
    unlimited: "Бессрочно",
  },
  internet_sharing: { with_sharing: "Есть", without_sharing: "Нет" },
  calls: { with_calls: "Есть", without_calls: "Нет" },
  top_up: { with_top_up: "Есть", without_top_up: "Нет" },
  kind: { service: "Сервис", game: "Игра" },
  card_category: {
    classic: "Классическая",
    electronic: "Электронная",
    gold: "Золотая",
    premium: "Премиальная",
    virtual: "Виртуальная",
  },
  approval: { high: "Высокое", medium: "Среднее", low: "Низкое" },
  loan_amount_type: { to_30000: "до 30 000 ₽", to_50000: "до 50 000 ₽", to_100000: "до 100 000 ₽" },
  loan_term_type: { to_30_days: "до 30 дней", to_35_days: "до 35 дней", to_180_days: "до 180 дней" },
  first_loan_type: {
    zero_first_loan: "Первый под 0%",
    standard_rate: "Стандартная ставка",
    needs_verification: "Требует проверки",
  },
  verification_status: { confirmed: "Подтверждены", manual_check: "Ручная проверка" },
  loan_limit_type: { small: "Небольшой", medium: "Средний", large: "Крупный" },
  loan_duration_type: { short: "Короткий", about_month: "Около месяца", long: "Долгий" },
  rating: { negative: "Отрицательный", neutral: "Нейтральный", positive: "Положительный" },
  // Страница обменника, к которой относится SEO-блок
  page: {
    main: "Главная",
    exchange_cash: "Обмен: наличные",
    exchange_noncash: "Обмен: безналичные",
    sell_cash: "Продажа за наличные",
    sell_noncash: "Продажа безнал",
    buy_cash: "Покупка за наличные",
    buy_noncash: "Покупка безнал",
  },
};

/** «limit_from» → «Limit from»: запасной вариант для полей без подписи. */
export const humanize = (name: string) =>
  name.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/** Названия компонентов Strapi (элементы repeatable-полей и блоки dynamic zone). */
export const COMPONENT_TITLES: Record<string, string> = {
  "virtual-card.promocode": "Промокод",
  "article.paragraph-content": "Абзац",
  "article.quote": "Цитата",
  "article.custom-button": "Кнопка",
  "article.accordion": "Вопрос-ответ",
};

/** Подписи полей внутри компонентов — по uid компонента (перекрывают общий словарь). */
export const COMPONENT_FIELD_LABELS: Record<string, Record<string, string>> = {
  "article.paragraph-content": { title: "Заголовок", content: "Текст", title_position: "Положение заголовка" },
  "article.quote": {
    content: "Текст цитаты",
    button_title: "Текст кнопки",
    button_url: "Ссылка кнопки",
    button_type: "Цвет кнопки",
  },
  "article.custom-button": {
    content: "Текст кнопки",
    url: "Ссылка",
    position: "Положение",
    button_type: "Цвет кнопки",
  },
  "article.accordion": { title: "Заголовок", question: "Вопрос", answer: "Ответ" },
  "virtual-card.promocode": { title: "Название", icon: "Иконка", description: "Описание", url: "Ссылка" },
};

/** Значения enum внутри компонентов (общие для всех article.*). */
export const COMPONENT_ENUM_LABELS: Record<string, Record<string, string>> = {
  title_position: { left: "Слева", center: "По центру", right: "Справа" },
  position: { left: "Слева", center: "По центру", right: "Справа" },
  button_type: { main_color: "Жёлтая", grey_color: "Серая", blue_color: "Синяя" },
};
