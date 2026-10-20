"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { runSequential, updateRelation } from "@/cms/api/bulk";
import { getRelationValues } from "@/cms/api/entries";
import { CMS_COLLECTIONS } from "@/cms/config/collections";
import { FIELD_LABELS } from "@/cms/config/labels";
import { isFieldAllowed } from "@/cms/model/permissions";
import { useCmsSession } from "@/cms/model/session-context";
import { CmsAttribute, isRelation, relationTarget } from "@/cms/schema/attributes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui";
import { DiffSummary, OptionChecklist, RelationChip, useRelationOptions } from "../form/fields/relation-field";
import { toRelationItem } from "../form/form-model";
import { Sheet } from "../primitives/sheet";

const CHIPS_LIMIT = 10;

/**
 * Обратная связь справочника («страна → ВЭД-агенты»). Привязки хранятся
 * у агента, поэтому изменения записываются в агентов — по одному запросу
 * на агента, с вебхуком и ревалидацией его раздела.
 */
function InverseRelation({
  uid,
  id,
  field,
  attribute,
  count,
}: {
  uid: string;
  id: number;
  field: string;
  attribute: Extract<CmsAttribute, { type: "relation" }>;
  count: number;
}) {
  const { ability } = useCmsSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const owner = relationTarget(attribute);
  const ownerField = attribute.mappedBy as string;
  const ownerTitle = CMS_COLLECTIONS[owner]?.title ?? FIELD_LABELS[field] ?? field;
  const canEdit =
    ability.can("update", owner) && isFieldAllowed(ability.fields("update", owner), ownerField);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);

  const current = useQuery({
    queryKey: ["cms", "inverse", uid, id, field],
    queryFn: async () => {
      const raw = await getRelationValues(uid, id, field, true);
      return (Array.isArray(raw) ? raw : []).map((r) => toRelationItem(r));
    },
    enabled: count > 0 || open,
  });
  const { options, isLoading, iconOf } = useRelationOptions(uid, field, owner, open);
  const linked = useMemo(() => current.data ?? [], [current.data]);
  const linkedIds = useMemo(() => new Set(linked.map((l) => l.id)), [linked]);

  // Черновик собираем один раз за открытие и только когда текущие привязки
  // уже загружены. Иначе пустой черновик выглядел бы как «открепить всех»,
  // а повторный запрос списка сбрасывал бы отметки пользователя.
  const initialized = useRef(false);
  useEffect(() => {
    if (!open) {
      initialized.current = false;
      return;
    }
    if (!initialized.current && current.isSuccess) {
      setDraft(new Set(linkedIds));
      initialized.current = true;
    }
  }, [open, linkedIds, current.isSuccess]);
  const ready = open && current.isSuccess;

  const added = ready ? Array.from(draft).filter((x) => !linkedIds.has(x)) : [];
  const removed = ready ? Array.from(linkedIds).filter((x) => !draft.has(x)) : [];

  const apply = async () => {
    const tasks = [
      ...added.map((ownerId) => ({ ownerId, change: { connect: [id] } })),
      ...removed.map((ownerId) => ({ ownerId, change: { disconnect: [id] } })),
    ];
    setProgress({ processed: 0, total: tasks.length });
    const result = await runSequential(
      tasks,
      (t) => updateRelation(owner, t.ownerId, ownerField, t.change),
      (processed, total) => setProgress({ processed, total }),
    );
    setProgress(null);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["cms", "inverse", uid, id, field] }),
      queryClient.invalidateQueries({ queryKey: ["cms", "entry", uid] }),
      queryClient.invalidateQueries({ queryKey: ["cms", "list", owner] }),
    ]);
    if (result.failed.length) {
      toast({
        title: `Обновлено ${result.done} из ${tasks.length}`,
        description: `Не удалось: ${result.failed.length}. ${result.failed[0].message}`,
        variant: "destructive",
      });
    } else {
      toast({ title: `Обновлено: ${ownerTitle.toLowerCase()} (${result.done})` });
      setOpen(false);
    }
  };

  const chips = linked.map((l) => ({ ...l, icon: iconOf(l.id) }));

  return (
    <div className="grid min-w-0 gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">
          {ownerTitle} <span className="tabular-nums text-muted-foreground">· {count}</span>
        </span>
        {canEdit && (
          <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
            <Pencil className="size-3.5 mr-1.5" />
            Изменить
          </Button>
        )}
      </div>
      {current.isLoading && count > 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Загрузка…
        </div>
      ) : chips.length ? (
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {chips.slice(0, CHIPS_LIMIT).map((c) => (
            <RelationChip key={c.id} item={c} />
          ))}
          {chips.length > CHIPS_LIMIT && (
            <span className="px-2 py-1 text-xs text-muted-foreground">ещё {chips.length - CHIPS_LIMIT}</span>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Не используется</p>
      )}

      <Sheet
        open={open}
        onOpenChange={(v) => !progress && setOpen(v)}
        title={ownerTitle}
        description="Отметьте, у кого эта запись должна быть"
        className="sm:max-w-lg"
        footer={
          progress ? (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Обновлено {progress.processed} из {progress.total}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <DiffSummary added={added.length} removed={removed.length} />
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button disabled={!ready || (!added.length && !removed.length)} onClick={apply}>
                Применить
              </Button>
            </div>
          )
        }
      >
        {open && <OptionChecklist options={options} loading={isLoading || current.isLoading} value={draft} onChange={setDraft} />}
      </Sheet>
    </div>
  );
}

/** Секция «Где используется»: все обратные связи записи справочника. */
export function InverseRelations({
  uid,
  id,
  fields,
  counts,
}: {
  uid: string;
  id: number;
  fields: [string, CmsAttribute][];
  counts: Record<string, number>;
}) {
  // Редактируем только «многие ко многим»: у «один ко многим» (отзывы)
  // запись принадлежит одному владельцу — для них отдельная вкладка.
  const editable = fields.filter(([, a]) => isRelation(a) && a.relation === "manyToMany");
  const others = fields.filter(([, a]) => !(isRelation(a) && a.relation === "manyToMany"));
  return (
    <div className="grid gap-3">
      {editable.map(([name, a]) => (
        <InverseRelation
          key={name}
          uid={uid}
          id={id}
          field={name}
          attribute={a as Extract<CmsAttribute, { type: "relation" }>}
          count={counts[name] ?? 0}
        />
      ))}
      {others.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {others.map(([name]) => (
            <span key={name} className="rounded-lg bg-secondary px-3 py-1.5 text-sm">
              {FIELD_LABELS[name] ?? name}: <span className="tabular-nums">{counts[name] ?? 0}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
