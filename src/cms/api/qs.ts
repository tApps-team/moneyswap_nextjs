/**
 * Сериализация вложенных объектов в query-строку в формате, который понимает
 * Strapi (он разбирает её через `qs`):
 *   { filters: { name: { $containsi: "x" } } } → filters[name][$containsi]=x
 * Массивы — с индексами: ids[0]=1&ids[1]=2.
 */
export function toQueryString(params: Record<string, unknown>): string {
  const parts: string[] = [];

  const walk = (value: unknown, key: string) => {
    if (value === undefined) return;
    if (value === null) {
      parts.push(`${key}=`);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${key}[${i}]`));
    } else if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => walk(v, `${key}[${k}]`));
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  };

  Object.entries(params).forEach(([k, v]) => walk(v, encodeURIComponent(k)));
  return parts.join("&");
}
