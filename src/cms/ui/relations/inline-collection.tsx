"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CmsEntry, listEntries } from "@/cms/api/content-manager";
import { deleteEntry, publishEntry, unpublishEntry } from "@/cms/api/entries";
import { CMS_COLLECTIONS } from "@/cms/config/collections";
import { contentTypeTitle } from "@/cms/model/navigation";
import { useCmsSession } from "@/cms/model/session-context";
import { CmsAttribute, relationTarget } from "@/cms/schema/attributes";
import { attributeOf, buildCollectionModel } from "@/cms/schema/collection";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui";
import { EntryFormSheet } from "../form/entry-form-sheet";
import { CellValue, StatusBadge } from "../list/cell";
import { ConfirmDialog } from "../primitives/confirm";

/** Поля, которые показываем в строке дочерней записи (что есть у коллекции). */
const PREVIEW_FIELDS = ["rating", "review_date", "text"];

/**
 * Дочерние записи прямо в карточке — например, отзывы агента. Каждый отзыв
 * принадлежит одному агенту (связь «многие к одному» на стороне отзыва),
 * поэтому новый отзыв создаётся уже привязанным к текущей записи.
 */
export function InlineCollection({
  parentId,
  parentLabel,
  attribute,
}: {
  parentId: number;
  parentLabel: string;
  attribute: Extract<CmsAttribute, { type: "relation" }>;
}) {
  const { contentTypes, ability, strapiUrl } = useCmsSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const owner = relationTarget(attribute);
  const ownerField = attribute.mappedBy as string;
  const ct = contentTypes.find((c) => c.uid === owner);
  const model = useMemo(() => (ct ? buildCollectionModel(ct, contentTypeTitle(ct)) : null), [ct]);

  const [editing, setEditing] = useState<number | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<CmsEntry | null>(null);

  const queryKey = ["cms", "list", owner, "inline", ownerField, parentId];
  const list = useQuery({
    queryKey,
    enabled: Boolean(model) && ability.can("read", owner),
    queryFn: () =>
      listEntries(owner, {
        page: 1,
        pageSize: 100,
        sort: model?.attributes.review_date ? "review_date:DESC" : "createdAt:DESC",
        filters: [{ [ownerField]: { id: { $eq: parentId } } }],
      }),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["cms", "list", owner] });
    queryClient.invalidateQueries({ queryKey: ["cms", "entry"] });
  };

  const remove = useMutation({
    mutationFn: (e: CmsEntry) => deleteEntry({ uid: owner, kind: "collectionType", id: e.id }),
    onSuccess: () => {
      toast({ title: "Удалено" });
      setToDelete(null);
      refresh();
    },
    onError: (err) => toast({ title: "Не удалось удалить", description: (err as Error).message, variant: "destructive" }),
  });

  const togglePublish = useMutation({
    mutationFn: (e: CmsEntry) =>
      (e.publishedAt ? unpublishEntry : publishEntry)({ uid: owner, kind: "collectionType", id: e.id }),
    onSuccess: refresh,
    onError: (err) => toast({ title: "Не удалось изменить статус", description: (err as Error).message, variant: "destructive" }),
  });

  if (!model) return null;
  if (!ability.can("read", owner)) {
    return <p className="text-sm text-muted-foreground">У вашей роли нет доступа к этому разделу.</p>;
  }

  const canCreate = ability.can("create", owner);
  const canUpdate = ability.can("update", owner);
  const canDelete = ability.can("delete", owner);
  const canPublish = model.hasDraftAndPublish && ability.can("publish", owner);
  const fields = PREVIEW_FIELDS.filter((f) => model.attributes[f]);
  const noun = (CMS_COLLECTIONS[owner]?.title ?? model.title).toLowerCase();
  const entries = list.data?.results ?? [];

  return (
    <div className="grid min-w-0 gap-3">
      {list.isLoading ? (
        <div className="h-16 rounded-lg bg-secondary animate-pulse" />
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет</p>
      ) : (
        <div className="grid gap-2">
          {entries.map((e) => (
            <div key={e.id} className="grid min-w-0 gap-2 rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{model.entryLabel(e)}</span>
                {fields
                  .filter((f) => f !== "text")
                  .map((f) => (
                    <CellValue
                      key={f}
                      field={f}
                      value={e[f]}
                      attribute={attributeOf(model, f)}
                      enumLabel={model.enumLabel}
                      strapiUrl={strapiUrl}
                    />
                  ))}
                {model.hasDraftAndPublish && <StatusBadge publishedAt={e.publishedAt} />}
                <div className="ml-auto flex gap-1">
                  {canPublish && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={togglePublish.isPending}
                      onClick={() => togglePublish.mutate(e)}
                      aria-label={e.publishedAt ? "Снять с публикации" : "Опубликовать"}
                      title={e.publishedAt ? "Снять с публикации" : "Опубликовать"}
                    >
                      {e.publishedAt ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  )}
                  {canUpdate && (
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(e.id)} aria-label="Изменить">
                      <Pencil className="size-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-red-300"
                      onClick={() => setToDelete(e)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
              {fields.includes("text") && typeof e.text === "string" && e.text && (
                <p className="line-clamp-3 text-sm text-muted-foreground break-words">{e.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {canCreate && (
        <Button type="button" variant="secondary" className="justify-self-start" onClick={() => setEditing(null)}>
          <Plus className="size-4 mr-1.5" />
          Добавить
        </Button>
      )}

      <EntryFormSheet
        open={editing !== undefined}
        onOpenChange={(v) => !v && setEditing(undefined)}
        uid={owner}
        id={editing ?? null}
        title={editing === null ? `Новая запись: ${noun}` : undefined}
        locked={{ [ownerField]: { id: parentId, label: parentLabel } }}
        publishByDefault
        onSaved={refresh}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Удалить запись?"
        description={toDelete ? `«${model.entryLabel(toDelete)}» будет удалена из Strapi.` : undefined}
        confirmLabel="Удалить"
        destructive
        pending={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
