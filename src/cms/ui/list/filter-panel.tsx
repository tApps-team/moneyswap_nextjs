"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchRelationAll } from "@/cms/api/content-manager";
import { isRelation } from "@/cms/schema/attributes";
import { attributeOf, CollectionModel, isRangeFilterable } from "@/cms/schema/collection";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { CmsCheckbox } from "../primitives/checkbox";
import { Sheet } from "../primitives/sheet";
import { relationLabel } from "./cell";
import { compactFilters, FilterState, FilterValue, STATUS_FILTER } from "./filters";

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm transition-colors",
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CheckList({
  options,
  selected,
  onChange,
  loading,
}: {
  options: { value: string | number; label: string }[];
  selected: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  loading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Загрузка…
      </div>
    );
  }
  if (!options.length) return <p className="text-sm text-muted-foreground">Нет значений</p>;

  const set = new Set(selected.map(String));
  const toggle = (v: string | number) =>
    onChange(set.has(String(v)) ? selected.filter((s) => String(s) !== String(v)) : [...selected, v]);

  return (
    <div className="grid gap-2">
      {options.length > 8 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" className="pl-9 h-9" />
        </div>
      )}
      <div className="grid max-h-60 gap-0.5 overflow-y-auto pr-1">
        {shown.map((o) => (
          <label
            key={String(o.value)}
            className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
          >
            <CmsCheckbox
              className="mt-0.5"
              checked={set.has(String(o.value))}
              onCheckedChange={() => toggle(o.value)}
            />
            <span className="min-w-0 break-words leading-snug">{o.label}</span>
          </label>
        ))}
        {!shown.length && <p className="px-2 py-1.5 text-sm text-muted-foreground">Ничего не найдено</p>}
      </div>
    </div>
  );
}

function RelationFilter({
  model,
  field,
  enabled,
  value,
  onChange,
}: {
  model: CollectionModel;
  field: string;
  enabled: boolean;
  value: (string | number)[];
  onChange: (v: (string | number)[]) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["cms", "relation-options", model.uid, field],
    queryFn: () => searchRelationAll(model.uid, field),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
  const options = useMemo(
    () =>
      (data ?? [])
        .map((o) => ({ value: o.id, label: relationLabel(o) }))
        .sort((a, b) => a.label.localeCompare(b.label, "ru")),
    [data],
  );
  return <CheckList options={options} selected={value} onChange={onChange} loading={isLoading} />;
}

export function FilterPanel({
  open,
  onOpenChange,
  model,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: CollectionModel;
  value: FilterState;
  onApply: (filters: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const set = (field: string, v: FilterValue | undefined) =>
    setDraft((d) => {
      const next = { ...d };
      if (v) next[field] = v;
      else delete next[field];
      return next;
    });

  const inValues = (field: string) => {
    const v = draft[field];
    return v?.kind === "in" ? v.values : [];
  };

  const apply = () => {
    onApply(compactFilters(draft));
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Фильтры"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDraft({})}>
            Сбросить
          </Button>
          <Button className="flex-1" onClick={apply}>
            Применить
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        {model.hasDraftAndPublish && (
          <section className="grid gap-2">
            <h3 className="text-sm font-medium">Статус</h3>
            <Segmented
              value={draft[STATUS_FILTER]?.kind === "status" ? (draft[STATUS_FILTER] as { value: string }).value : "all"}
              options={[
                { value: "all", label: "Все" },
                { value: "published", label: "Опубликовано" },
                { value: "draft", label: "Черновик" },
              ]}
              onChange={(v) =>
                set(STATUS_FILTER, v === "all" ? undefined : { kind: "status", value: v as "draft" | "published" })
              }
            />
          </section>
        )}

        {model.filterFields.map((field) => {
          const attr = attributeOf(model, field);
          if (!attr) return null;
          const label = model.fieldLabel(field);

          if (attr.type === "boolean") {
            const cur = draft[field];
            return (
              <section key={field} className="grid gap-2">
                <h3 className="text-sm font-medium">{label}</h3>
                <Segmented
                  value={cur?.kind === "bool" ? (cur.value ? "yes" : "no") : "all"}
                  options={[
                    { value: "all", label: "Все" },
                    { value: "yes", label: "Да" },
                    { value: "no", label: "Нет" },
                  ]}
                  onChange={(v) => set(field, v === "all" ? undefined : { kind: "bool", value: v === "yes" })}
                />
              </section>
            );
          }

          if (attr.type === "enumeration") {
            return (
              <section key={field} className="grid gap-2">
                <h3 className="text-sm font-medium">{label}</h3>
                <CheckList
                  options={attr.enum.map((e) => ({ value: e, label: model.enumLabel(field, e) }))}
                  selected={inValues(field)}
                  onChange={(values) => set(field, { kind: "in", values })}
                />
              </section>
            );
          }

          if (isRelation(attr)) {
            return (
              <section key={field} className="grid gap-2">
                <h3 className="text-sm font-medium">
                  {label}
                  <span className="ml-1.5 font-normal text-muted-foreground">— есть хотя бы одно</span>
                </h3>
                <RelationFilter
                  model={model}
                  field={field}
                  enabled={open}
                  value={inValues(field)}
                  onChange={(values) => set(field, { kind: "in", values })}
                />
              </section>
            );
          }

          if (isRangeFilterable(attr)) {
            const cur = draft[field]?.kind === "range" ? (draft[field] as { min?: string; max?: string }) : {};
            const type = attr.type === "date" || attr.type === "datetime" ? "date" : "number";
            return (
              <section key={field} className="grid gap-2">
                <h3 className="text-sm font-medium">{label}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type={type}
                    placeholder="от"
                    value={cur.min ?? ""}
                    onChange={(e) => set(field, { kind: "range", min: e.target.value, max: cur.max })}
                  />
                  <Input
                    type={type}
                    placeholder="до"
                    value={cur.max ?? ""}
                    onChange={(e) => set(field, { kind: "range", min: cur.min, max: e.target.value })}
                  />
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>
    </Sheet>
  );
}
