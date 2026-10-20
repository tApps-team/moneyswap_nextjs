"use client";

/* eslint-disable @next/next/no-img-element -- иконки справочников из Strapi */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ListChecks, Loader2, Pencil, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { listEntries, searchRelationAll } from "@/cms/api/content-manager";
import { useCmsSession } from "@/cms/model/session-context";
import { buildCollectionModel } from "@/cms/schema/collection";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { relationLabel } from "../../list/cell";
import { CmsMedia, mediaThumb } from "../../media";
import { CmsCheckbox } from "../../primitives/checkbox";
import { Sheet } from "../../primitives/sheet";
import { EntryFormSheet } from "../entry-form-sheet";
import { FormValues, RelationItem, toRelationItem } from "../form-model";
import { slugify } from "../slugify";

/**
 * Иконки записей справочника (флаги, логотипы). Список связей Strapi отдаёт
 * только названия, поэтому иконки берём из самой коллекции — если у роли есть
 * право её читать. Нет права — просто показываем названия.
 */
export function useTargetIcons(target: string) {
  const { ability, strapiUrl } = useCmsSession();
  const canRead = ability.can("read", target);
  const { data } = useQuery({
    queryKey: ["cms", "icons", target],
    enabled: canRead,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const map = new Map<number, string>();
      for (let page = 1; page <= 10; page++) {
        const res = await listEntries(target, { page, pageSize: 100 });
        for (const e of res.results) {
          const media = (e.icon ?? e.logo) as CmsMedia | null | undefined;
          const src = mediaThumb(strapiUrl, media);
          if (src) map.set(e.id, src);
        }
        if (page >= res.pagination.pageCount) break;
      }
      return map;
    },
  });
  return (id: number) => data?.get(id) ?? null;
}

/** Все записи, которые можно привязать к полю (с иконками). */
export function useRelationOptions(
  source: string,
  field: string,
  target: string,
  enabled: boolean,
) {
  const iconOf = useTargetIcons(target);
  const query = useQuery({
    queryKey: ["cms", "relation-options", source, field],
    queryFn: () => searchRelationAll(source, field),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
  const options = useMemo<RelationItem[]>(
    () =>
      (query.data ?? [])
        .map((o) => ({
          id: o.id,
          label: relationLabel(o),
          publishedAt: o.publishedAt ?? null,
          icon: iconOf(o.id),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "ru")),
    [query.data, iconOf],
  );
  return { options, isLoading: query.isLoading, isError: query.isError, iconOf };
}

/** Первая буква подписи для заглушки иконки: «#Биткоин» → «Б». */
const initial = (label: string) => (label.replace(/^[^0-9A-Za-zА-Яа-яЁё]+/, "") || label).slice(0, 1);

function ItemIcon({ src, label }: { src?: string | null; label: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[10px] font-semibold uppercase text-muted-foreground">
        {initial(label)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-6 shrink-0 rounded-full object-cover"
    />
  );
}

/** Чип связанной записи. */
export function RelationChip({ item, onRemove }: { item: RelationItem; onRemove?: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-secondary py-1 pl-1 pr-2 text-xs">
      <ItemIcon src={item.icon} label={item.label} />
      <span className="truncate">{item.label}</span>
      {item.publishedAt === null && <span className="text-amber-300">· черновик</span>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Убрать «${item.label}»`}
          className="-mr-1 grid size-5 shrink-0 place-items-center rounded-full hover:bg-accent"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

/**
 * Список записей с поиском, «выбрать все найденные» и фильтром «только
 * выбранные». Общий для панели выбора в карточке, массовой привязки из
 * списка и вкладки «Где используется» у справочника.
 */
export function OptionChecklist({
  options,
  loading,
  value,
  onChange,
  multiple = true,
  highlight,
  onCreate,
}: {
  options: RelationItem[];
  loading: boolean;
  value: Set<number>;
  onChange: (next: Set<number>) => void;
  multiple?: boolean;
  /** Подсветка уже привязанных — когда список выбирает «что сделать», а не «что есть». */
  highlight?: Set<number>;
  /** Создать новую запись справочника — с текстом поиска как названием. */
  onCreate?: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => (!q || o.label.toLowerCase().includes(q)) && (!onlySelected || value.has(o.id)),
    );
  }, [options, query, onlySelected, value]);

  const shownSelected = shown.filter((o) => value.has(o.id)).length;
  const allShownSelected = shown.length > 0 && shownSelected === shown.length;

  const toggle = (id: number) => {
    if (!multiple) return onChange(new Set([id]));
    const next = new Set(value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const selectShown = (on: boolean) => {
    const next = new Set(value);
    shown.forEach((o) => (on ? next.add(o.id) : next.delete(o.id)));
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск"
          className="h-10 pl-9"
        />
      </div>

      {(multiple || onCreate) && (
        <div className="flex flex-wrap items-center gap-2">
          {multiple && (
            <>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={!shown.length}
                onClick={() => selectShown(!allShownSelected)}
              >
                <ListChecks className="size-4 mr-1.5" />
                {allShownSelected
                  ? `Снять ${query ? "найденные" : "все"} (${shown.length})`
                  : `Выбрать ${query ? "найденные" : "все"} (${shown.length})`}
              </Button>
              <button
                type="button"
                onClick={() => setOnlySelected((v) => !v)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  onlySelected
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                Только выбранные
              </button>
            </>
          )}
          {onCreate && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={() => onCreate(query.trim())}
            >
              <Plus className="size-4 mr-1.5" />
              Новая запись
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Загрузка…
        </div>
      ) : !shown.length ? (
        <div className="grid justify-items-center gap-3 py-6 text-center">
          <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          {onCreate && query.trim() && (
            <Button type="button" size="sm" onClick={() => onCreate(query.trim())}>
              <Plus className="size-4 mr-1.5" />
              Создать «{query.trim()}»
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-0.5">
          {shown.map((o) => {
            const active = value.has(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                  active ? "bg-primary/10" : "hover:bg-secondary",
                )}
              >
                {multiple ? (
                  <CmsCheckbox
                    checked={active}
                    tabIndex={-1}
                    aria-hidden
                    className="pointer-events-none"
                  />
                ) : (
                  <span
                    className={cn(
                      "grid size-[18px] shrink-0 place-items-center rounded-full border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/60",
                    )}
                  >
                    {active && <Check className="size-3" strokeWidth={3} />}
                  </span>
                )}
                <ItemIcon src={o.icon} label={o.label} />
                <span className="min-w-0 flex-1 break-words">{o.label}</span>
                {highlight?.has(o.id) && (
                  <span className="shrink-0 text-xs text-muted-foreground">уже есть</span>
                )}
                {o.publishedAt === null && (
                  <span className="shrink-0 text-xs text-amber-300">черновик</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Сводка изменений «+12 / −3» для подвала панелей. */
export function DiffSummary({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="mr-auto text-sm tabular-nums">
      {added > 0 && <span className="text-emerald-300">+{added}</span>}
      {added > 0 && removed > 0 && <span className="text-muted-foreground"> / </span>}
      {removed > 0 && <span className="text-red-300">−{removed}</span>}
      {!added && !removed && <span className="text-muted-foreground">Без изменений</span>}
    </span>
  );
}

/**
 * Панель выбора записей справочника — главный инструмент против «по одной
 * за раз»: весь справочник списком, поиск, отметка всех найденных одним
 * нажатием и сводка изменений перед применением.
 */
export function RelationPicker({
  open,
  onOpenChange,
  title,
  options,
  loading,
  selected,
  multiple,
  onApply,
  createTarget,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  options: RelationItem[];
  loading: boolean;
  selected: RelationItem[];
  multiple: boolean;
  onApply: (items: RelationItem[]) => void;
  /** uid справочника, если роли можно создавать в нём записи. */
  createTarget?: string;
  /** Новая запись создана — список вариантов надо обновить. */
  onCreated?: (item: RelationItem) => void;
}) {
  const { contentTypes } = useCmsSession();
  const [draft, setDraft] = useState<Set<number>>(new Set());
  const [createPreset, setCreatePreset] = useState<FormValues | null>(null);
  const [created, setCreated] = useState<RelationItem[]>([]);

  /** Предзаполнение новой записи из текста поиска: название, адрес, код. */
  const startCreate = (query: string) => {
    const ct = contentTypes.find((c) => c.uid === createTarget);
    if (!ct) return;
    const model = buildCollectionModel(ct, ct.info.displayName);
    const preset: FormValues = {};
    if (query) {
      if (model.mainField !== "id") preset[model.mainField] = query;
      if (model.attributes.slug) preset.slug = slugify(query);
      if (model.attributes.code && model.mainField !== "code")
        preset.code = query.toUpperCase().slice(0, 10);
    }
    setCreatePreset(preset);
  };
  // Черновик собираем только в момент открытия. Список выбранных родитель
  // пересоздаёт на каждый рендер (догрузились иконки, обновились варианты) —
  // если реагировать на него, отметки пользователя слетали бы посреди работы.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setDraft(new Set(selected.map((s) => s.id)));
      setCreated([]);
    }
    wasOpen.current = open;
  }, [open, selected]);

  const initialIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);
  const added = Array.from(draft).filter((id) => !initialIds.has(id)).length;
  const removed = Array.from(initialIds).filter((id) => !draft.has(id)).length;

  const apply = () => {
    // Сохраняем порядок: сначала уже привязанные (как были), потом новые.
    const byId = new Map([...created, ...options].map((o) => [o.id, o]));
    const kept = selected
      .filter((s) => draft.has(s.id))
      .map((s) => ({ ...s, icon: byId.get(s.id)?.icon ?? s.icon }));
    const fresh = Array.from(draft)
      .filter((id) => !initialIds.has(id))
      .map((id) => byId.get(id))
      .filter((x): x is RelationItem => Boolean(x));
    onApply([...kept, ...fresh]);
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={multiple ? `Выбрано ${draft.size} из ${options.length}` : "Выберите одну запись"}
      className="sm:max-w-lg"
      footer={
        <div className="flex items-center gap-2">
          <DiffSummary added={added} removed={removed} />
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={apply} disabled={!added && !removed}>
            Применить
          </Button>
        </div>
      }
    >
      {open && (
        <OptionChecklist
          options={options}
          loading={loading}
          value={draft}
          onChange={setDraft}
          multiple={multiple}
          onCreate={createTarget ? startCreate : undefined}
        />
      )}
      {createTarget && (
        <EntryFormSheet
          open={createPreset !== null}
          onOpenChange={(v) => !v && setCreatePreset(null)}
          uid={createTarget}
          id={null}
          preset={createPreset ?? undefined}
          publishByDefault
          onSaved={(entry) => {
            const item = toRelationItem(entry);
            setCreated((prev) => [...prev, item]);
            // Новая запись сразу отмечена — её и создавали, чтобы выбрать.
            setDraft((prev) => (multiple ? new Set(prev).add(item.id) : new Set([item.id])));
            onCreated?.(item);
          }}
        />
      )}
    </Sheet>
  );
}

const CHIPS_LIMIT = 12;

/** Поле связи в форме: чипы выбранного и панель выбора. */
export function RelationInput({
  source,
  field,
  target,
  label,
  multiple,
  value,
  onChange,
  disabled,
}: {
  source: string;
  field: string;
  target: string;
  label: string;
  multiple: boolean;
  value: RelationItem[] | RelationItem | null;
  onChange: (v: RelationItem[] | RelationItem | null) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { options, isLoading, iconOf } = useRelationOptions(source, field, target, open);
  const [expanded, setExpanded] = useState(false);
  const { ability } = useCmsSession();
  const queryClient = useQueryClient();
  const canCreateTarget = ability.can("create", target);

  const list = multiple ? ((value as RelationItem[]) ?? []) : value ? [value as RelationItem] : [];
  // Иконки могли подгрузиться позже значений — дополняем на лету.
  const withIcons = list.map((item) => ({ ...item, icon: item.icon ?? iconOf(item.id) }));
  const visible = expanded ? withIcons : withIcons.slice(0, CHIPS_LIMIT);

  const remove = (id: number) =>
    multiple ? onChange(list.filter((i) => i.id !== id)) : onChange(null);

  return (
    <div className="grid min-w-0 gap-2 rounded-lg border border-border p-3">
      {withIcons.length > 0 ? (
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {visible.map((item) => (
            <RelationChip
              key={item.id}
              item={item}
              onRemove={disabled ? undefined : () => remove(item.id)}
            />
          ))}
          {withIcons.length > CHIPS_LIMIT && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full px-2.5 py-1 text-xs text-primary hover:bg-secondary"
            >
              {expanded ? "Свернуть" : `ещё ${withIcons.length - CHIPS_LIMIT}`}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Ничего не выбрано</p>
      )}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
            <Pencil className="size-3.5 mr-1.5" />
            {multiple
              ? `Изменить${list.length ? ` (${list.length})` : ""}`
              : list.length
                ? "Заменить"
                : "Выбрать"}
          </Button>
          {multiple && list.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-muted-foreground hover:text-red-300"
            >
              Очистить
            </button>
          )}
        </div>
      )}
      <RelationPicker
        open={open}
        onOpenChange={setOpen}
        title={label}
        options={options}
        loading={isLoading}
        selected={withIcons}
        multiple={multiple}
        onApply={(items) => onChange(multiple ? items : (items[0] ?? null))}
        createTarget={canCreateTarget ? target : undefined}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["cms", "relation-options"] });
          queryClient.invalidateQueries({ queryKey: ["cms", "icons", target] });
        }}
      />
    </div>
  );
}
