import { createHash } from "node:crypto";
import { strapiAdminGet } from "@/cms/server/strapi-admin";

/**
 * Статистика открыта всем ролям CMS, но только вошедшим: токен проверяется
 * у Strapi. Ответ кэшируется на минуту — отчёт делает много запросов разом.
 */
const cache = new Map<string, number>();
const TTL = 60_000;

export async function isValidCmsToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const key = createHash("sha256").update(token).digest("hex");
  const until = cache.get(key);
  if (until && until > Date.now()) return true;
  try {
    await strapiAdminGet(token, "admin/users/me");
    cache.set(key, Date.now() + TTL);
    if (cache.size > 500) cache.forEach((v, k) => v < Date.now() && cache.delete(k));
    return true;
  } catch {
    cache.delete(key);
    return false;
  }
}
