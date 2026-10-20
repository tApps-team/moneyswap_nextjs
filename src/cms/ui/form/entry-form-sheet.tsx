"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CmsApiError } from "@/cms/api/client";
import { CmsEntry } from "@/cms/api/content-manager";
import { createEntry, publishEntry, updateEntry } from "@/cms/api/entries";
import { COMPONENT_TITLES } from "@/cms/config/labels";
import { contentTypeTitle } from "@/cms/model/navigation";
import { isFieldAllowed } from "@/cms/model/permissions";
import { useCmsSession } from "@/cms/model/session-context";
import { CmsAttributes } from "@/cms/schema/attributes";
import { buildCollectionModel } from "@/cms/schema/collection";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui";
import { CmsCheckbox } from "../primitives/checkbox";
import { Sheet } from "../primitives/sheet";
import { FieldContext, FieldRenderer } from "./field-renderer";
import { buildPayload, entryToFormValues, FormValues, isFormField, missingRequired } from "./form-model";
import { useEntryData } from "./use-entry-data";

/**
 * Запись другой коллекции в боковой панели — не уходя со страницы:
 * отзыв внутри карточки агента, новая страна прямо из выбора стран.
 *
 * `preset` — начальные значения новой записи; `locked` — поля, которые
 * задаются снаружи и в форме не показываются (например, агент у отзыва).
 */
export function EntryFormSheet({
  open,
  onOpenChange,
  uid,
  id,
  title,
  preset,
  locked,
  publishByDefault = false,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  uid: string;
  id: number | null;
  title?: string;
  preset?: FormValues;
  locked?: FormValues;
  publishByDefault?: boolean;
  onSaved?: (entry: CmsEntry) => void;
}) {
  const { contentTypes, components, ability } = useCmsSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const ct = contentTypes.find((c) => c.uid === uid);
  const model = useMemo(() => (ct ? buildCollectionModel(ct, contentTypeTitle(ct)) : null), [ct]);
  const componentAttrs = useCallback(
    (cuid: string) => components.find((c) => c.uid === cuid)?.attributes as CmsAttributes | undefined,
    [components],
  );

  const isNew = id === null;
  const data = useEntryData(uid, model?.attributes ?? {}, "collectionType", open ? id : null);

  const [values, setValues] = useState<FormValues | null>(null);
  const [baseline, setBaseline] = useState<FormValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [publishNow, setPublishNow] = useState(publishByDefault);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !model) return;
    if (!isNew && !data.data) return;
    const base = entryToFormValues(data.data?.entry ?? null, model.attributes, data.data?.relations ?? {}, componentAttrs);
    const start = { ...base, ...(isNew ? preset : {}), ...locked };
    setValues(start);
    setBaseline(isNew ? base : start);
    setErrors({});
    setPublishNow(publishByDefault);
    // preset/locked — объекты от родителя; пересобираем форму только при открытии и загрузке
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, model, isNew, data.data, componentAttrs]);

  if (!model) return null;

  const action = isNew ? "create" : "update";
  const allowed = ability.fields(action, uid);
  const canPublish = model.hasDraftAndPublish && ability.can("publish", uid);
  const fields = Object.entries(model.attributes).filter(
    ([name, a]) => isFormField(name, a) && !(locked && name in locked),
  );

  const ctx: FieldContext = {
    uid,
    label: model.fieldLabel,
    enumLabel: model.enumLabel,
    componentAttrs,
    componentTitle: (cuid) => COMPONENT_TITLES[cuid] ?? "Элемент",
    mainValue: values?.[model.slug.from],
    slugField: model.slug.field,
    errors,
    isDisabled: (field) => !ability.can(action, uid) || !isFieldAllowed(allowed, field),
  };

  const save = async () => {
    if (!values || !baseline) return;
    const missing = missingRequired(model.attributes, values);
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((f) => [f, "Обязательное поле"])));
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(model.attributes, values, baseline, isNew, componentAttrs);
      let saved = isNew
        ? await createEntry(uid, payload)
        : await updateEntry({ uid, kind: "collectionType", id }, payload);
      if (canPublish && publishNow && !saved.publishedAt) {
        saved = await publishEntry({ uid, kind: "collectionType", id: saved.id });
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cms", "list", uid] }),
        queryClient.invalidateQueries({ queryKey: ["cms", "count", uid] }),
        queryClient.invalidateQueries({ queryKey: ["cms", "entry", uid] }),
      ]);
      toast({ title: isNew ? "Запись создана" : "Сохранено" });
      onSaved?.(saved);
      onOpenChange(false);
    } catch (err) {
      const details = err instanceof CmsApiError ? (err.details as { errors?: { path?: string[]; message: string }[] }) : undefined;
      const fieldErrors: Record<string, string> = {};
      for (const e of details?.errors ?? []) if (e.path?.[0]) fieldErrors[e.path[0]] = e.message;
      setErrors(fieldErrors);
      toast({
        title: "Не удалось сохранить",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => !saving && onOpenChange(v)}
      title={title ?? (isNew ? `Новая запись: ${model.title}` : model.title)}
      className="sm:max-w-xl"
      footer={
        <div className="flex flex-wrap items-center gap-2">
          {canPublish && (isNew || !data.data?.entry?.publishedAt) && (
            <div className="mr-auto flex items-center gap-2 text-sm">
              <CmsCheckbox
                id={`publish-now-${uid}`}
                checked={publishNow}
                onCheckedChange={(v) => setPublishNow(v === true)}
              />
              <label htmlFor={`publish-now-${uid}`}>Сразу опубликовать</label>
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" disabled={saving} onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button disabled={saving || !values} onClick={save}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isNew ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </div>
      }
    >
      {!values ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Загрузка…
        </div>
      ) : (
        <div className="grid gap-4">
          {fields.map(([name, a]) => (
            <FieldRenderer
              key={name}
              name={name}
              attribute={a}
              value={values[name]}
              onChange={(v) => {
                setValues((prev) => (prev ? { ...prev, [name]: v } : prev));
                if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
              }}
              ctx={ctx}
              idPrefix={`sheet-${uid.split(".").pop()}`}
            />
          ))}
        </div>
      )}
    </Sheet>
  );
}
