"use client";

import { useQuery } from "@tanstack/react-query";
import { CmsApiError } from "@/cms/api/client";
import { CmsEntry } from "@/cms/api/content-manager";
import { getEntry, getRelationValues } from "@/cms/api/entries";
import { CmsAttributes, isRelation, isToMany } from "@/cms/schema/attributes";
import { isFormField, RelationItem, toRelationItem } from "./form-model";

export interface EntryData {
  entry: CmsEntry | null;
  relations: Record<string, RelationItem[] | RelationItem | null>;
}

/**
 * Запись и текущие значения её связей одним запросом для формы.
 * В ответе записи Content Manager отдаёт связи только как `{ count }`,
 * поэтому значения подгружаются отдельно, по полю.
 *
 * `id = null` у коллекции — новая запись, загружать нечего.
 */
export function useEntryData(
  uid: string,
  attributes: CmsAttributes,
  kind: "collectionType" | "singleType",
  id: number | null,
) {
  const isSingle = kind === "singleType";
  return useQuery<EntryData>({
    queryKey: ["cms", "entry", uid, kind, id],
    enabled: isSingle || id !== null,
    queryFn: async () => {
      let entry: CmsEntry;
      try {
        entry = await getEntry({ uid, kind, id });
      } catch (err) {
        // У single type, который ещё ни разу не сохраняли, записи нет — это не ошибка.
        if (isSingle && err instanceof CmsApiError && err.status === 404) return { entry: null, relations: {} };
        throw err;
      }
      const relations: EntryData["relations"] = {};
      await Promise.all(
        Object.entries(attributes)
          .filter(([name, a]) => isRelation(a) && isFormField(name, a))
          .map(async ([name, a]) => {
            const raw = await getRelationValues(uid, entry.id, name, isToMany(a));
            relations[name] = Array.isArray(raw) ? raw.map((r) => toRelationItem(r)) : raw ? toRelationItem(raw) : null;
          }),
      );
      return { entry, relations };
    },
  });
}
