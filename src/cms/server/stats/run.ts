import { withClient } from "@/shared/analytics/server/db";
import { Sql } from "./query";

/** Выполнить запрос отчёта. Строки — как есть, числа приводятся в отчётах. */
export async function run<T = Record<string, unknown>>(q: Sql, sql: string): Promise<T[]> {
  return withClient(async (client) => (await client.query(sql, q.params)).rows as T[]);
}

/** Названия агентов, статей и т. п. из словаря, который пополняется при сборе. */
export async function entityNames(kinds: string[]): Promise<Map<string, string>> {
  const q = new Sql();
  const rows = await run<{ kind: string; slug: string; name: string }>(
    q,
    `select kind, slug, name from ms_entities where kind = any(${q.p(kinds)})`,
  );
  return new Map(rows.map((r) => [`${r.kind}:${r.slug}`, r.name]));
}
