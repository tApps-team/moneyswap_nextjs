import { z } from "zod";
import { classifyPath, isStatSection } from "../classify";
import { EVENT_TYPES } from "../events";
import { analyticsPool, withClient } from "./db";
import { isBot, parseUa } from "./ua";

/** Сколько дней храним сырые события. */
const RETENTION_DAYS = Number(process.env.ANALYTICS_RETENTION_DAYS ?? 400);
/** Насколько верим часам браузера относительно времени приёма. */
const MAX_CLOCK_SKEW_MS = 10 * 60 * 1000;

const str = (max: number) => z.string().max(max * 4).transform((v) => v.slice(0, max));
const int = z.number().int().min(-1_000_000_000).max(1_000_000_000);
const uuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

const eventSchema = z.object({
  t: z.enum(EVENT_TYPES),
  ts: z.number(),
  p: str(500),
  s: str(40).optional(),
  e: str(160).optional(),
  n: str(200).optional(),
  v: str(300).optional(),
  src: str(300).optional(),
  pos: int.optional(),
  num: int.optional(),
  num2: int.optional(),
});

export const batchSchema = z.object({
  vid: uuid,
  sid: uuid,
  st: z.literal(1).optional(),
  events: z.array(eventSchema).min(1).max(60),
});

export type Batch = z.infer<typeof batchSchema>;

const COLUMNS = [
  "ts", "type", "visitor_id", "session_id", "view_id", "path", "page_type", "page_section", "page_entity",
  "section", "entity", "name", "value", "source", "position", "num", "num2",
  "referrer_host", "utm_source", "utm_medium", "utm_campaign", "device", "browser", "os", "is_staff",
] as const;

const hostOf = (url: string | undefined) => {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
};

const titleOnly = (title: string | undefined) => (title ?? "").replace(/\s*[|—–-]\s*MoneySwap.*$/i, "").trim();

let lastCleanup = 0;

/** Раз в сутки удаляем события старше срока хранения — без отдельного крона. */
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 24 * 60 * 60 * 1000) return;
  lastCleanup = now;
  analyticsPool()
    .query(`delete from ms_events where ts < now() - make_interval(days => $1)`, [RETENTION_DAYS])
    .catch((err) => console.error("[analytics] cleanup failed:", err.message));
}

/**
 * Запись пачки событий: время по часам сервера, тип страницы и раздел —
 * по адресу, устройство — по User-Agent, источник и UTM — для просмотров.
 */
export async function ingest(batch: Batch, userAgent: string): Promise<number> {
  if (isBot(userAgent)) return 0;
  const { device, browser, os } = parseUa(userAgent);
  const received = Date.now();
  const latestClient = Math.max(...batch.events.map((e) => e.ts));

  const rows: unknown[][] = [];
  const names = new Map<string, { kind: string; slug: string; name: string }>();

  for (const e of batch.events) {
    const skew = Math.min(Math.max(latestClient - e.ts, 0), MAX_CLOCK_SKEW_MS);
    const ts = new Date(received - skew);
    const page = classifyPath(e.p);
    let query: URLSearchParams | null = null;
    try {
      query = new URL(e.p, "https://moneyswap.online").searchParams;
    } catch {
      query = null;
    }
    const isAgentEvent = ["impression", "detail_click", "outbound_click"].includes(e.t);
    const section = isAgentEvent && isStatSection(e.s) ? e.s : null;
    const entity = isAgentEvent && section ? e.e ?? null : null;
    const isView = e.t === "page_view";

    // Названия агентов и статей — для отчётов, где есть только slug.
    if (section && entity && e.n) names.set(`${section}:${entity}`, { kind: section, slug: entity, name: e.n });
    if (isView && page.entity && e.n) {
      const kind = page.pageType === "agent" ? page.section : page.pageType;
      const name = page.pageType === "agent" ? e.n : titleOnly(e.n);
      if (kind && name) names.set(`${kind}:${page.entity}`, { kind, slug: page.entity, name });
    }

    rows.push([
      ts,
      e.t,
      batch.vid,
      batch.sid,
      e.t === "page_view" || e.t === "page_leave" ? e.v ?? null : null,
      e.p.split("#")[0],
      page.pageType,
      page.section,
      page.entity,
      section,
      entity,
      isView ? titleOnly(e.n) || null : e.n ?? null,
      isView || e.t === "page_leave" ? null : e.v ?? null,
      isView ? null : e.src ?? null,
      e.pos ?? null,
      e.num ?? null,
      e.num2 ?? null,
      isView ? hostOf(e.src) : null,
      isView ? query?.get("utm_source")?.slice(0, 120) ?? null : null,
      isView ? query?.get("utm_medium")?.slice(0, 120) ?? null : null,
      isView ? query?.get("utm_campaign")?.slice(0, 160) ?? null : null,
      device,
      browser,
      os,
      batch.st === 1,
    ]);
  }

  await withClient(async (client) => {
    const values = rows
      .map((_, r) => `(${COLUMNS.map((__, c) => `$${r * COLUMNS.length + c + 1}`).join(",")})`)
      .join(",");
    await client.query(`insert into ms_events (${COLUMNS.join(",")}) values ${values}`, rows.flat());
    if (names.size) {
      const list = Array.from(names.values());
      const params = list.flatMap((n) => [n.kind, n.slug, n.name]);
      const tuples = list.map((_, i) => `($${i * 3 + 1},$${i * 3 + 2},$${i * 3 + 3},now())`).join(",");
      await client.query(
        `insert into ms_entities (kind, slug, name, updated_at) values ${tuples}
         on conflict (kind, slug) do update set name = excluded.name, updated_at = now()
         where ms_entities.name is distinct from excluded.name`,
        params,
      );
    }
  });
  maybeCleanup();
  return rows.length;
}
