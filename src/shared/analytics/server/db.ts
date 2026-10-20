import { Pool, PoolClient } from "pg";

/**
 * База собственной статистики — отдельная от Strapi. Подключается одной
 * переменной ANALYTICS_DATABASE_URL; без неё сбор молча выключен, а сайт
 * работает как раньше. Таблицы создаются сами при первом обращении.
 */

const globalStore = globalThis as unknown as {
  msAnalyticsPool?: Pool;
  msAnalyticsSchema?: Promise<void>;
};

export const analyticsEnabled = () => Boolean(process.env.ANALYTICS_DATABASE_URL);

export function analyticsPool(): Pool {
  if (!globalStore.msAnalyticsPool) {
    globalStore.msAnalyticsPool = new Pool({
      connectionString: process.env.ANALYTICS_DATABASE_URL,
      max: Number(process.env.ANALYTICS_DB_POOL ?? 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      // Тяжёлый отчёт не должен держать соединение бесконечно.
      statement_timeout: 20_000,
      application_name: "moneyswap-next-analytics",
    });
    // Ошибка простаивающего соединения не должна ронять процесс сайта.
    globalStore.msAnalyticsPool.on("error", (err) => console.error("[analytics] pool error:", err.message));
  }
  return globalStore.msAnalyticsPool;
}

const SCHEMA = `
create table if not exists ms_events (
  id            bigserial primary key,
  ts            timestamptz not null,
  type          text not null,
  visitor_id    uuid not null,
  session_id    uuid not null,
  view_id       text,
  path          text not null,
  page_type     text not null,
  page_section  text,
  page_entity   text,
  section       text,
  entity        text,
  name          text,
  value         text,
  source        text,
  position      smallint,
  num           integer,
  num2          integer,
  referrer_host text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  device        text not null,
  browser       text,
  os            text,
  is_staff      boolean not null default false
);
create index if not exists ms_events_ts_brin on ms_events using brin (ts);
create index if not exists ms_events_type_ts on ms_events (type, ts);
create index if not exists ms_events_agent on ms_events (section, entity, ts) where entity is not null;
create index if not exists ms_events_session on ms_events (session_id, ts);
create index if not exists ms_events_visitor on ms_events (visitor_id, ts);
create index if not exists ms_events_page on ms_events (page_type, ts);

create table if not exists ms_entities (
  kind       text not null,
  slug       text not null,
  name       text not null,
  updated_at timestamptz not null default now(),
  primary key (kind, slug)
);
`;

export function ensureSchema(): Promise<void> {
  if (!globalStore.msAnalyticsSchema) {
    globalStore.msAnalyticsSchema = analyticsPool()
      .query(SCHEMA)
      .then(() => undefined)
      .catch((err) => {
        globalStore.msAnalyticsSchema = undefined;
        throw err;
      });
  }
  return globalStore.msAnalyticsSchema;
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await analyticsPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
