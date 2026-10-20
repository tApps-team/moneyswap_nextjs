"use client";

/* eslint-disable @next/next/no-img-element -- картинки из Strapi любых размеров, оптимизатор Next тут не нужен */
import { useQuery } from "@tanstack/react-query";
import { Check, ImageOff, Link2 } from "lucide-react";
import { useState } from "react";
import { getRelationPreview } from "@/cms/api/entries";
import { CmsAttribute, isNumeric, isRelation, isToMany, MAIN_FIELD_CANDIDATES } from "@/cms/schema/attributes";
import { cn } from "@/shared/lib";
import { CmsMedia, mediaThumb } from "../media";

/** Подпись связанной записи: её «главное» поле, иначе id. */
export function relationLabel(rel: Record<string, unknown> | null | undefined): string {
  if (!rel) return "—";
  for (const key of MAIN_FIELD_CANDIDATES) {
    const v = rel[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return `#${rel.id}`;
}

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const numberFmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 4 });

export function StatusBadge({ publishedAt }: { publishedAt: unknown }) {
  const published = Boolean(publishedAt);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        published ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300",
      )}
    >
      <span className={cn("size-1.5 rounded-full", published ? "bg-emerald-400" : "bg-amber-400")} />
      {published ? "Опубликовано" : "Черновик"}
    </span>
  );
}

function Thumb({ media, strapiUrl }: { media: CmsMedia | null | undefined; strapiUrl: string }) {
  const src = mediaThumb(strapiUrl, media);
  // Файл может отсутствовать физически (битая ссылка, локальная копия базы
  // без папки uploads) — тогда показываем заглушку вместо значка битой картинки.
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="grid place-items-center size-9 rounded-lg bg-secondary text-muted-foreground">
        <ImageOff className="size-4" />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={media?.alternativeText ?? ""}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-9 rounded-lg bg-secondary object-contain"
    />
  );
}

/** Значение поля записи в ячейке списка, по типу атрибута. */
export function CellValue({
  field,
  value,
  attribute,
  enumLabel,
  strapiUrl,
  owner,
}: {
  field: string;
  value: unknown;
  attribute: CmsAttribute | undefined;
  enumLabel: (field: string, value: string) => string;
  strapiUrl: string;
  /** Запись, которой принадлежит ячейка: тогда у связей «ко многим» подгружаются названия. */
  owner?: { uid: string; id: number };
}) {
  if (field === "publishedAt") return <StatusBadge publishedAt={value} />;
  if (!attribute) return <span className="text-muted-foreground">—</span>;

  const empty = <span className="text-muted-foreground">—</span>;

  switch (attribute.type) {
    case "media": {
      const media = Array.isArray(value) ? (value[0] as CmsMedia | undefined) : (value as CmsMedia | null);
      return <Thumb media={media} strapiUrl={strapiUrl} />;
    }
    case "boolean":
      return value ? (
        <span className="inline-grid place-items-center size-6 rounded-md bg-primary/15 text-primary">
          <Check className="size-4" />
        </span>
      ) : (
        empty
      );
    case "enumeration":
      return value ? (
        <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs whitespace-nowrap">
          {enumLabel(field, String(value))}
        </span>
      ) : (
        empty
      );
    case "date":
      return value ? <span className="whitespace-nowrap">{dateFmt.format(new Date(String(value)))}</span> : empty;
    case "datetime":
    case "timestamp":
      return value ? (
        <span className="whitespace-nowrap text-muted-foreground">{dateTimeFmt.format(new Date(String(value)))}</span>
      ) : (
        empty
      );
    case "relation": {
      if (isRelation(attribute) && isToMany(attribute)) {
        const count = (value as { count?: number } | null)?.count ?? 0;
        if (count && owner) return <RelationNames owner={owner} field={field} count={count} />;
        return count ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs tabular-nums whitespace-nowrap">
            <Link2 className="size-3" />
            {count}
          </span>
        ) : (
          empty
        );
      }
      return value ? <span className="truncate">{relationLabel(value as Record<string, unknown>)}</span> : empty;
    }
    default:
      if (value === null || value === undefined || value === "") return empty;
      if (isNumeric(attribute)) {
        const n = Number(value);
        return <span className="tabular-nums whitespace-nowrap">{Number.isFinite(n) ? numberFmt.format(n) : String(value)}</span>;
      }
      return <span className="line-clamp-2 break-words">{String(value)}</span>;
  }
}

/**
 * Названия связанных записей в ячейке. Список Strapi отдаёт по связям «ко многим»
 * только число, поэтому первые несколько названий догружаем для видимых строк.
 */
function RelationNames({ owner, field, count }: { owner: { uid: string; id: number }; field: string; count: number }) {
  const { data } = useQuery({
    // Префикс ["cms", "list", uid] — сбрасывается вместе со списком после правок.
    queryKey: ["cms", "list", owner.uid, "relation-preview", owner.id, field],
    queryFn: () => getRelationPreview(owner.uid, owner.id, field),
    staleTime: 60 * 1000,
  });
  if (!data) {
    return <span className="inline-block h-5 w-20 animate-pulse rounded-md bg-secondary align-middle" />;
  }
  const rest = Math.max(data.total, count) - data.items.length;
  return (
    <span className="flex min-w-0 flex-wrap gap-1">
      {data.items.map((item) => (
        <span key={item.id} className="max-w-[160px] truncate rounded-md bg-secondary px-2 py-0.5 text-xs">
          {relationLabel(item)}
        </span>
      ))}
      {rest > 0 && <span className="px-1 py-0.5 text-xs text-muted-foreground whitespace-nowrap">ещё {rest}</span>}
    </span>
  );
}
