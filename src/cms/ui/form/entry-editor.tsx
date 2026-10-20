"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { CmsApiError } from "@/cms/api/client";
import { CmsEntry } from "@/cms/api/content-manager";
import {
  createEntry,
  deleteEntry,
  EntryRef,
  getConfiguration,
  publishEntry,
  unpublishEntry,
  updateEntry,
} from "@/cms/api/entries";
import { COMPONENT_TITLES } from "@/cms/config/labels";
import { isFieldAllowed } from "@/cms/model/permissions";
import { useCmsSession } from "@/cms/model/session-context";
import { CmsAttribute, CmsAttributes } from "@/cms/schema/attributes";
import { CollectionModel } from "@/cms/schema/collection";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { StatusBadge } from "../list/cell";
import { ConfirmDialog } from "../primitives/confirm";
import { InlineCollection } from "../relations/inline-collection";
import { InverseRelations } from "../relations/inverse-relations";
import { FieldContext, FieldRenderer } from "./field-renderer";
import {
  buildPayload,
  dirtyFields,
  entryToFormValues,
  FormValues,
  isFormField,
  isInverseRelation,
  missingRequired,
} from "./form-model";
import { useEntryData } from "./use-entry-data";

/** Ширина поля из раскладки Strapi (12 колонок) → класс сетки. */
const SPAN: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  12: "lg:col-span-12",
};

const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const hasCyrillic = (s: string) => /[а-яё]/i.test(s);

function Section({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="grid min-w-0 gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="grid gap-0.5">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** Ошибки валидации Strapi → { поле: сообщение }. */
function fieldErrorsFrom(err: unknown): Record<string, string> {
  if (!(err instanceof CmsApiError)) return {};
  const details = err.details as { errors?: { path?: (string | number)[]; message: string }[] } | undefined;
  const out: Record<string, string> = {};
  for (const e of details?.errors ?? []) {
    const field = e.path?.[0];
    if (typeof field === "string" && !out[field]) out[field] = e.message;
  }
  return out;
}

export interface EntryEditorProps {
  model: CollectionModel;
  kind: "collectionType" | "singleType";
  /** Для коллекций: id записи или null для новой. */
  id: number | null;
  /** id записи-источника для дублирования. */
  cloneFrom?: number | null;
  /** Адрес списка коллекции (для коллекций). */
  listHref?: string;
}

/** Копия значения компонента или dynamic zone без id — рекурсивно по вложенным компонентам. */
function withoutComponentIds(
  value: unknown,
  attribute: CmsAttribute,
  componentAttrs: (uid: string) => CmsAttributes | undefined,
): unknown {
  const strip = (item: FormValues, uid: string): FormValues => {
    const rest: FormValues = { ...item };
    delete rest.id;
    for (const [name, inner] of Object.entries(componentAttrs(uid) ?? {})) {
      if (inner.type === "component") rest[name] = withoutComponentIds(rest[name], inner, componentAttrs);
    }
    return rest;
  };
  if (attribute.type === "dynamiczone") {
    return Array.isArray(value) ? value.map((x) => strip(x as FormValues, String((x as FormValues).__component))) : value;
  }
  if (attribute.type !== "component") return value;
  if (Array.isArray(value)) return value.map((x) => strip(x as FormValues, attribute.component));
  return value ? strip(value as FormValues, attribute.component) : value;
}

/** Адрес записи на сайте: {поле} из шаблона заменяется значением записи. */
function buildSitePath(template: string | undefined, entry: Record<string, unknown>): string | null {
  if (!template) return null;
  let missing = false;
  const path = template.replace(/\{(\w+)\}/g, (_, field: string) => {
    const v = entry[field];
    if (typeof v !== "string" || !v) missing = true;
    return encodeURIComponent(String(v ?? ""));
  });
  return missing ? null : path;
}

export function EntryEditor({ model, kind, id, cloneFrom, listHref }: EntryEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { ability, components } = useCmsSession();

  const isSingle = kind === "singleType";
  const isNew = !isSingle && id === null;
  const ref: EntryRef = { uid: model.uid, kind, id };
  const sourceId = isNew ? cloneFrom ?? null : id;

  const componentAttrs = useCallback(
    (uid: string) => components.find((c) => c.uid === uid)?.attributes as CmsAttributes | undefined,
    [components],
  );

  const config = useQuery({
    queryKey: ["cms", "configuration", model.uid],
    queryFn: () => getConfiguration(model.uid),
    staleTime: 10 * 60 * 1000,
  });

  const loaded = useEntryData(model.uid, model.attributes, kind, isSingle ? null : sourceId);

  const entry = loaded.data?.entry ?? null;

  /** Начальные значения: из записи, при дублировании — без адреса и с пометкой «копия». */
  const initial = useMemo<FormValues | null>(() => {
    if (!isNew && !isSingle && !loaded.data) return null;
    if (isSingle && !loaded.data) return null;
    if (isNew && cloneFrom && !loaded.data) return null;
    const values = entryToFormValues(entry, model.attributes, loaded.data?.relations ?? {}, componentAttrs);
    if (isNew && cloneFrom) {
      const mainType = model.attributes[model.mainField]?.type;
      if ((mainType === "string" || mainType === "text") && typeof values[model.mainField] === "string") {
        values[model.mainField] = `${values[model.mainField]} (копия)`;
      }
      const slugField = model.slug.field;
      if (slugField in values) values[slugField] = values[slugField] ? `${values[slugField]}-copy` : null;
      // У копии компоненты и блоки dynamic zone создаются заново — без id
      // исходных, иначе Strapi принял бы их за правку блоков оригинала.
      for (const [name, a] of Object.entries(model.attributes)) {
        if (a.type === "component" || a.type === "dynamiczone") values[name] = withoutComponentIds(values[name], a, componentAttrs);
      }
    }
    return values;
  }, [loaded.data, entry, model, componentAttrs, isNew, isSingle, cloneFrom]);

  const [values, setValues] = useState<FormValues | null>(null);
  const [baseline, setBaseline] = useState<FormValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (initial) {
      setValues(initial);
      // У копии сравниваем с пустой формой: всё заполненное — изменения.
      setBaseline(isNew && cloneFrom ? {} : initial);
      setErrors({});
    }
  }, [initial, isNew, cloneFrom]);

  // Новая запись без источника — пустая форма без загрузки.
  useEffect(() => {
    if (isNew && !cloneFrom) {
      const empty = entryToFormValues(null, model.attributes, {}, componentAttrs);
      setValues(empty);
      setBaseline(empty);
    }
  }, [isNew, cloneFrom, model.attributes, componentAttrs]);

  const dirty = values && baseline ? dirtyFields(values, baseline) : [];
  const isDirty = isNew ? true : dirty.length > 0;

  // Защита от потери правок при закрытии вкладки.
  useEffect(() => {
    if (!isDirty || isNew) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, isNew]);

  const metadatas = useMemo(() => config.data?.data.contentType.metadatas ?? {}, [config.data]);
  const label = (field: string) => {
    const custom = metadatas[field]?.edit?.label;
    return (
      model.config?.fieldLabels?.[field] ??
      (custom && custom !== field && hasCyrillic(custom) ? custom : undefined) ??
      model.fieldLabel(field)
    );
  };
  const hint = (field: string) => metadatas[field]?.edit?.description || undefined;

  const action = isNew ? "create" : "update";
  const allowedFields = ability.fields(action, model.uid);
  const canEdit = ability.can(action, model.uid);
  const isDisabled = (field: string) =>
    !canEdit || metadatas[field]?.edit?.editable === false || !isFieldAllowed(allowedFields, field);

  const READ_ONLY = "Только просмотр: у вашей роли нет прав на это поле";
  const readOnlyByRole = (field: string) => canEdit && !isFieldAllowed(allowedFields, field);

  const ctx: FieldContext = {
    uid: model.uid,
    label,
    hint: (field) => (readOnlyByRole(field) ? READ_ONLY : hint(field)),
    enumLabel: model.enumLabel,
    componentAttrs,
    componentTitle: (uid) =>
      COMPONENT_TITLES[uid] ?? components.find((c) => c.uid === uid)?.info.displayName ?? "Элемент",
    mainValue: values?.[model.slug.from],
    slugField: model.slug.field,
    errors,
    isDisabled,
  };

  /** Поля формы в порядке раскладки Strapi, с шириной. */
  const orderedFields = useMemo(() => {
    const layout = config.data?.data.contentType.layouts.edit ?? [];
    const seen = new Set<string>();
    const out: { name: string; size: number }[] = [];
    for (const row of layout) {
      for (const cell of row) {
        if (seen.has(cell.name)) continue;
        seen.add(cell.name);
        out.push(cell);
      }
    }
    // Поля, которых нет в раскладке (новые или скрытые там), — в конец.
    for (const name of Object.keys(model.attributes)) if (!seen.has(name)) out.push({ name, size: 6 });
    return out.filter(({ name }) => {
      const a = model.attributes[name];
      return a && isFormField(name, a) && metadatas[name]?.edit?.visible !== false;
    });
  }, [config.data, model.attributes, metadatas]);

  const mainFields = orderedFields.filter(({ name }) => {
    const t = model.attributes[name].type;
    return t !== "relation" && t !== "component" && t !== "dynamiczone";
  });
  const relationFields = orderedFields.filter(({ name }) => model.attributes[name].type === "relation");
  // Компоненты и dynamic zone — каждый своей секцией: это крупные блоки.
  const blockSections = orderedFields.filter(({ name }) => {
    const t = model.attributes[name].type;
    return t === "component" || t === "dynamiczone";
  });
  const allInverse = Object.entries(model.attributes).filter(([, a]) => isInverseRelation(a));
  // «Один ко многим» с обратной стороны — дочерние записи (отзывы агента):
  // их показываем списком прямо в карточке, с добавлением и правкой.
  const childFields = allInverse.filter(([, a]) => a.type === "relation" && a.relation === "oneToMany");
  const inverseFields = allInverse.filter(([, a]) => !(a.type === "relation" && a.relation === "oneToMany"));

  const setField = (name: string, v: unknown) => {
    setValues((prev) => (prev ? { ...prev, [name]: v } : prev));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  // Возврат к списку в том же виде (фильтры, страница), в каком его оставили.
  const [backHref, setBackHref] = useState(listHref ?? "");
  useEffect(() => {
    if (!listHref) return;
    try {
      setBackHref(sessionStorage.getItem(`cms:list:${model.uid}`) ?? listHref);
    } catch {
      setBackHref(listHref);
    }
  }, [listHref, model.uid]);

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ["cms", "list", model.uid] });
    queryClient.invalidateQueries({ queryKey: ["cms", "count", model.uid] });
  };

  /** Сохранение. Возвращает сохранённую запись (для публикации сразу после). */
  const save = useMutation({
    mutationFn: async () => {
      if (!values || !baseline) throw new Error("Форма не готова");
      const missing = missingRequired(model.attributes, values);
      if (missing.length) {
        setErrors(Object.fromEntries(missing.map((f) => [f, "Обязательное поле"])));
        throw new CmsApiError(400, `Заполните обязательные поля: ${missing.map(label).join(", ")}`);
      }
      const payload = buildPayload(model.attributes, values, baseline, isNew, componentAttrs);
      if (isNew) return createEntry(model.uid, payload);
      if (!Object.keys(payload).length) return entry as CmsEntry;
      return updateEntry(ref, payload);
    },
    onSuccess: async (saved) => {
      setErrors({});
      invalidateLists();
      if (isNew && listHref) {
        toast({ title: "Запись создана" });
        router.replace(`${listHref}/${saved.id}`);
        return;
      }
      toast({ title: "Сохранено" });
      // Перечитываем запись: новые элементы компонентов получили id от Strapi.
      await queryClient.invalidateQueries({ queryKey: ["cms", "entry", model.uid, kind, sourceId] });
    },
    onError: (err) => {
      setErrors((prev) => ({ ...prev, ...fieldErrorsFrom(err) }));
      toast({
        title: "Не удалось сохранить",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    },
  });

  const publish = useMutation({
    mutationFn: async (on: boolean) => {
      if (on && isDirty) await save.mutateAsync();
      return on ? publishEntry(ref) : unpublishEntry(ref);
    },
    onSuccess: async (_res, on) => {
      toast({ title: on ? "Опубликовано" : "Снято с публикации" });
      invalidateLists();
      await queryClient.invalidateQueries({ queryKey: ["cms", "entry", model.uid, kind, sourceId] });
    },
    onError: (err, on) => {
      setErrors((prev) => ({ ...prev, ...fieldErrorsFrom(err) }));
      toast({
        title: on ? "Не удалось опубликовать" : "Не удалось снять с публикации",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteEntry(ref),
    onSuccess: () => {
      toast({ title: "Запись удалена" });
      invalidateLists();
      router.replace(backHref);
    },
    onError: (err) =>
      toast({
        title: "Не удалось удалить",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      }),
  });

  const busy = save.isPending || publish.isPending || remove.isPending;
  const published = Boolean(entry?.publishedAt);
  const canPublish = model.hasDraftAndPublish && ability.can("publish", model.uid) && !isNew;
  const canDelete = !isSingle && !isNew && ability.can("delete", model.uid);
  const canDuplicate = !isSingle && !isNew && ability.can("create", model.uid);
  const sitePath = published && entry ? buildSitePath(model.config?.sitePath, entry) : null;

  const title = isNew
    ? cloneFrom
      ? "Копия записи"
      : "Новая запись"
    : isSingle
      ? model.title
      : model.entryLabel(values?.[model.mainField] ? values : entry) || `Запись #${id}`;

  if (loaded.isError) {
    const notFound = loaded.error instanceof CmsApiError && loaded.error.status === 404;
    return (
      <div className="grid place-items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          {notFound ? "Запись не найдена — возможно, её удалили." : "Не удалось загрузить запись."}
        </p>
        {listHref && (
          <Button variant="secondary" asChild>
            <Link href={backHref || listHref}>К списку</Link>
          </Button>
        )}
      </div>
    );
  }

  if (!values || config.isLoading) {
    return (
      <div className="grid gap-4">
        <div className="h-10 w-72 rounded-lg bg-card animate-pulse" />
        <div className="h-64 rounded-2xl bg-card animate-pulse" />
        <div className="h-48 rounded-2xl bg-card animate-pulse" />
      </div>
    );
  }

  const renderGrid = (fields: { name: string; size: number }[]) => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {fields.map(({ name, size }) => {
        const a = model.attributes[name];
        const full = ["text", "blocks", "media", "relation", "component"].includes(a.type);
        return (
          <div key={name} className={cn("min-w-0", full ? "lg:col-span-12" : SPAN[size] ?? "lg:col-span-6")}>
            <FieldRenderer name={name} attribute={a} value={values[name]} onChange={(v) => setField(name, v)} ctx={ctx} />
          </div>
        );
      })}
    </div>
  );

  const actions = (
    <div className="flex items-center gap-2">
      {canPublish && (
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => publish.mutate(!published)}
          className="flex-1 sm:flex-none"
        >
          {publish.isPending ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : published ? (
            <EyeOff className="size-4 mr-2" />
          ) : (
            <Eye className="size-4 mr-2" />
          )}
          {published ? "Снять" : isDirty ? "Сохранить и опубликовать" : "Опубликовать"}
        </Button>
      )}
      {canEdit && (
        <Button disabled={busy || !isDirty} onClick={() => save.mutate()} className="flex-1 sm:flex-none">
          {save.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
          {isNew ? "Создать" : "Сохранить"}
        </Button>
      )}
    </div>
  );

  return (
    <div className="pb-24 lg:pb-0">
      {/* Шапка */}
      <div className="mb-6 grid gap-3">
        {listHref && (
          <Link
            href={backHref || listHref}
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {model.title}
          </Link>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid min-w-0 gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight break-words">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {model.hasDraftAndPublish && !isNew && <StatusBadge publishedAt={entry?.publishedAt} />}
              {!isNew && isDirty && <span className="text-amber-300">Есть несохранённые изменения</span>}
              {entry?.updatedAt ? <span>Изменено {dateTimeFmt.format(new Date(String(entry.updatedAt)))}</span> : null}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {actions}
            {(canDuplicate || canDelete || sitePath) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" aria-label="Ещё действия">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sitePath && (
                    <DropdownMenuItem asChild>
                      <a href={sitePath} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4 mr-2" />
                        Открыть на сайте
                      </a>
                    </DropdownMenuItem>
                  )}
                  {canDuplicate && (
                    <DropdownMenuItem onSelect={() => router.push(`${listHref}/new?from=${id}`)}>
                      <Copy className="size-4 mr-2" />
                      Дублировать
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setConfirmDelete(true)} className="text-red-300 focus:text-red-300">
                        <Trash2 className="size-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {mainFields.length > 0 && <Section title="Основное">{renderGrid(mainFields)}</Section>}

        {relationFields.length > 0 && (
          <Section title="Связи" description="Нажмите «Изменить», чтобы выбрать сразу много записей из справочника.">
            {renderGrid(relationFields)}
          </Section>
        )}

        {blockSections.map(({ name }) => (
          <Section
            key={name}
            title={label(name)}
            description={
              readOnlyByRole(name)
                ? READ_ONLY
                : model.attributes[name].type === "dynamiczone"
                  ? "Блоки выводятся на сайте в этом порядке."
                  : undefined
            }
          >
            <FieldRenderer
              name={name}
              attribute={model.attributes[name]}
              value={values[name]}
              onChange={(v) => setField(name, v)}
              ctx={ctx}
            />
          </Section>
        ))}

        {!isNew &&
          !isSingle &&
          entry &&
          childFields.map(([name, a]) => (
            <Section key={name} title={label(name)}>
              <InlineCollection
                parentId={entry.id}
                parentLabel={model.entryLabel(entry)}
                attribute={a as Extract<CmsAttribute, { type: "relation" }>}
              />
            </Section>
          ))}

        {!isNew && !isSingle && inverseFields.length > 0 && entry && (
          <Section
            title="Где используется"
            description="Кому привязана эта запись. Изменения сохраняются сразу — в карточках самих записей."
          >
            <InverseRelations
              uid={model.uid}
              id={entry.id}
              fields={inverseFields}
              counts={Object.fromEntries(
                inverseFields.map(([name]) => [name, (entry[name] as { count?: number } | undefined)?.count ?? 0]),
              )}
            />
          </Section>
        )}
      </div>

      {/* Телефон: действия внизу экрана */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 grid gap-2 border-t border-border bg-background/95 p-3 backdrop-blur">
        {actions}
        {(canDuplicate || canDelete || sitePath) && (
          <div className="flex justify-center gap-4 text-sm">
            {sitePath && (
              <a href={sitePath} target="_blank" rel="noopener noreferrer" className="text-muted-foreground">
                На сайте
              </a>
            )}
            {canDuplicate && (
              <button type="button" className="text-muted-foreground" onClick={() => router.push(`${listHref}/new?from=${id}`)}>
                Дублировать
              </button>
            )}
            {canDelete && (
              <button type="button" className="text-red-300" onClick={() => setConfirmDelete(true)}>
                Удалить
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить запись?"
        description={`«${title}» будет удалена из Strapi вместе со связями. Отменить это нельзя.`}
        confirmLabel="Удалить"
        destructive
        pending={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
