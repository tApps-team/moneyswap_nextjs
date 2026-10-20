"use client";

import { CheckCircle2, Link2, Loader2, Unlink, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { runSequential, updateRelation } from "@/cms/api/bulk";
import { CmsEntry } from "@/cms/api/content-manager";
import { isFieldAllowed } from "@/cms/model/permissions";
import { useCmsSession } from "@/cms/model/session-context";
import { isContentRelation, isRelation, isToMany, relationTarget } from "@/cms/schema/attributes";
import { CollectionModel } from "@/cms/schema/collection";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { OptionChecklist, useRelationOptions } from "../form/fields/relation-field";
import { relationLabel } from "../list/cell";
import { Sheet } from "../primitives/sheet";

type Mode = "connect" | "disconnect";
type Phase = { kind: "pick" } | { kind: "running"; processed: number } | { kind: "done"; failed: { name: string; message: string }[] };

/** Связи «ко многим», которые можно массово менять у этой коллекции. */
export function bulkRelationFields(model: CollectionModel, allowed: string[] | null) {
  return Object.entries(model.attributes)
    .filter(
      ([name, a]) =>
        isRelation(a) && isToMany(a) && isContentRelation(a) && !a.mappedBy && isFieldAllowed(allowed, name),
    )
    .map(([name]) => name);
}

/**
 * Массовая привязка из списка: выбранным записям прикрепить или открепить
 * записи справочника. Каждая запись обновляется отдельным запросом —
 * с прогрессом и отчётом, если что-то не прошло.
 */
export function BulkRelationsSheet({
  open,
  onOpenChange,
  model,
  entries,
  onDone,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  model: CollectionModel;
  entries: CmsEntry[];
  onDone: () => void;
}) {
  const { ability } = useCmsSession();
  const fields = useMemo(() => bulkRelationFields(model, ability.fields("update", model.uid)), [model, ability]);
  const [field, setField] = useState(fields[0] ?? "");
  const [mode, setMode] = useState<Mode>("connect");
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<Phase>({ kind: "pick" });

  useEffect(() => {
    if (open) {
      setPhase({ kind: "pick" });
      setPicked(new Set());
      if (!fields.includes(field)) setField(fields[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- сброс только при открытии
  }, [open]);

  const attr = field ? model.attributes[field] : undefined;
  const target = attr && isRelation(attr) ? relationTarget(attr) : "";
  const { options, isLoading } = useRelationOptions(model.uid, field, target, open && Boolean(field));

  const run = async () => {
    setPhase({ kind: "running", processed: 0 });
    const ids = Array.from(picked);
    const result = await runSequential(
      entries,
      (entry) => updateRelation(model.uid, entry.id, field, mode === "connect" ? { connect: ids } : { disconnect: ids }),
      (processed) => setPhase({ kind: "running", processed }),
    );
    setPhase({
      kind: "done",
      failed: result.failed.map((f) => ({ name: model.entryLabel(f.item), message: f.message })),
    });
    onDone();
  };

  const running = phase.kind === "running";
  const fieldLabel = field ? model.fieldLabel(field) : "";
  const noun = entries.length === 1 ? "записи" : "записям";

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => !running && onOpenChange(v)}
      title="Массовое изменение связей"
      description={`Выбрано записей: ${entries.length}`}
      className="sm:max-w-lg"
      footer={
        phase.kind === "pick" ? (
          <div className="flex items-center gap-2">
            <span className="mr-auto text-sm text-muted-foreground">Отмечено: {picked.size}</span>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button disabled={!picked.size} variant={mode === "disconnect" ? "destructive" : "default"} onClick={run}>
              {mode === "connect" ? "Прикрепить" : "Открепить"}
            </Button>
          </div>
        ) : phase.kind === "done" ? (
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Готово
          </Button>
        ) : null
      }
    >
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">У этой коллекции нет связей, которые можно менять массово.</p>
      ) : phase.kind === "running" ? (
        <div className="grid gap-3 py-6">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Обработано {phase.processed} из {entries.length}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(phase.processed / Math.max(entries.length, 1)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Не закрывайте панель до окончания.</p>
        </div>
      ) : phase.kind === "done" ? (
        <div className="grid gap-4 py-2">
          <div className="flex items-start gap-3">
            {phase.failed.length ? (
              <XCircle className="size-6 shrink-0 text-amber-300" />
            ) : (
              <CheckCircle2 className="size-6 shrink-0 text-emerald-300" />
            )}
            <div className="grid gap-1">
              <p className="font-medium">
                {mode === "connect" ? "Прикреплено" : "Откреплено"}: {fieldLabel.toLowerCase()} ({picked.size}) у{" "}
                {entries.length - phase.failed.length} из {entries.length}
              </p>
              <p className="text-sm text-muted-foreground">Сайт обновится автоматически, как при сохранении в Strapi.</p>
            </div>
          </div>
          {phase.failed.length > 0 && (
            <div className="grid gap-1 rounded-lg bg-secondary p-3 text-sm">
              <p className="font-medium">Не удалось обновить:</p>
              {phase.failed.map((f) => (
                <p key={f.name} className="text-muted-foreground">
                  {f.name} — {f.message}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          <section className="grid gap-2">
            <h3 className="text-sm font-medium">Что меняем</h3>
            <div className="flex flex-wrap gap-2">
              {fields.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setField(f);
                    setPicked(new Set());
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    f === field ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary",
                  )}
                >
                  {model.fieldLabel(f)}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-2">
            <h3 className="text-sm font-medium">Действие</h3>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
              {(
                [
                  { value: "connect", label: "Прикрепить", icon: Link2 },
                  { value: "disconnect", label: "Открепить", icon: Unlink },
                ] as const
              ).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setMode(o.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    mode === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <o.icon className="size-4" />
                  {o.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === "connect"
                ? `Отмеченные ${fieldLabel.toLowerCase()} добавятся всем выбранным ${noun}. Уже привязанные останутся как есть.`
                : `Отмеченные ${fieldLabel.toLowerCase()} будут убраны у всех выбранных ${noun}. Остальные связи не тронутся.`}
            </p>
          </section>

          <section className="grid gap-2">
            <h3 className="text-sm font-medium">{fieldLabel}</h3>
            <OptionChecklist key={field} options={options} loading={isLoading} value={picked} onChange={setPicked} />
          </section>

          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Кому применится ({entries.length})</summary>
            <p className="mt-2">{entries.map((e) => relationLabel(e)).join(", ")}</p>
          </details>
        </div>
      )}
    </Sheet>
  );
}
