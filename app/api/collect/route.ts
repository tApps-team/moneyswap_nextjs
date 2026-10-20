import { NextRequest, NextResponse } from "next/server";
import { analyticsEnabled } from "@/shared/analytics/server/db";
import { batchSchema, ingest } from "@/shared/analytics/server/ingest";

/**
 * Приём событий собственной статистики (src/shared/analytics/tracker.ts).
 *
 * Всегда отвечает 204, даже на ошибку: браузеру и `sendBeacon` ответ не
 * нужен, а сбой базы статистики не должен ничего ломать на сайте.
 */

export const dynamic = "force-dynamic";

const MAX_BODY = 64 * 1024;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 400; // событий в минуту с одного адреса
const hits = new Map<string, { count: number; reset: number }>();

const noContent = () => new NextResponse(null, { status: 204 });

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function overLimit(ip: string, events: number) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: events, reset: now + RATE_WINDOW_MS });
    if (hits.size > 10_000) {
      hits.forEach((v, k) => {
        if (v.reset < now) hits.delete(k);
      });
    }
    return false;
  }
  entry.count += events;
  return entry.count > RATE_LIMIT;
}

/** Принимаем только со страниц самого сайта. */
function sameSite(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!host || !source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!analyticsEnabled() || !sameSite(req)) return noContent();
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return noContent();
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return noContent(); // пустое или битое тело — не повод шуметь в логах
    }
    const parsed = batchSchema.safeParse(json);
    if (!parsed.success) return noContent();
    if (overLimit(clientIp(req), parsed.data.events.length)) return noContent();
    await ingest(parsed.data, req.headers.get("user-agent") ?? "");
  } catch (err) {
    console.error("[analytics] collect failed:", err instanceof Error ? err.message : err);
  }
  return noContent();
}
