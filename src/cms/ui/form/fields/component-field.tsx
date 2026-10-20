"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CmsAttributes, SYSTEM_FIELDS } from "@/cms/schema/attributes";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { FormValues, newTempKey, TEMP_KEY } from "../form-model";

export type RenderInner = (args: {
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  idPrefix: string;
}) => React.ReactNode;

/** Подпись элемента списка: его название, если есть, иначе номер. */
const itemTitle = (item: FormValues, index: number, noun: string) => {
  for (const key of ["title", "name", "question", "content"]) {
    const v = item[key];
    if (typeof v === "string" && v.trim()) return v.trim().slice(0, 80);
  }
  return `${noun} ${index + 1}`;
};

function ComponentBody({
  attrs,
  item,
  onChange,
  idPrefix,
  renderInner,
}: {
  attrs: CmsAttributes;
  item: FormValues;
  onChange: (next: FormValues) => void;
  idPrefix: string;
  renderInner: RenderInner;
}) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {/* Strapi добавляет к атрибутам компонента служебный id — его не редактируют. */}
      {Object.keys(attrs)
        .filter((name) => !SYSTEM_FIELDS.includes(name))
        .map((name) => (
          <div
            key={name}
            className={cn(
              "min-w-0",
              ["text", "media", "component", "relation"].includes(attrs[name].type) &&
                "sm:col-span-2",
            )}
          >
            {renderInner({
              name,
              value: item[name],
              onChange: (v) => onChange({ ...item, [name]: v }),
              idPrefix,
            })}
          </div>
        ))}
    </div>
  );
}

/**
 * Компонент Strapi: одиночный (объект) или repeatable (список с порядком).
 * Существующие элементы сохраняют свой id — иначе Strapi пересоздаст их.
 */
export function ComponentInput({
  attrs,
  repeatable,
  value,
  onChange,
  noun,
  disabled,
  idPrefix,
  renderInner,
}: {
  attrs: CmsAttributes;
  repeatable: boolean;
  value: FormValues[] | FormValues | null;
  onChange: (v: FormValues[] | FormValues | null) => void;
  /** «Промокод», «Элемент» — для подписей кнопок и пустых элементов. */
  noun: string;
  disabled?: boolean;
  idPrefix: string;
  renderInner: RenderInner;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (!repeatable) {
    const item = value as FormValues | null;
    if (!item) {
      return (
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={() => onChange({ [TEMP_KEY]: newTempKey() })}
        >
          <Plus className="size-4 mr-1.5" />
          Заполнить
        </Button>
      );
    }
    return (
      <div className="rounded-xl border border-border p-4">
        <ComponentBody
          attrs={attrs}
          item={item}
          onChange={(next) => onChange(next)}
          idPrefix={idPrefix}
          renderInner={renderInner}
        />
      </div>
    );
  }

  const items = (value as FormValues[]) ?? [];
  const keyOf = (item: FormValues) => String(item[TEMP_KEY]);
  const update = (index: number, next: FormValues) =>
    onChange(items.map((it, i) => (i === index ? next : it)));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const toggleCollapsed = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const key = keyOf(item);
        const isCollapsed = collapsed.has(key);
        return (
          <div key={key} className="min-w-0 rounded-xl border border-border bg-background/40">
            <div className="flex items-center gap-1 px-3 py-2">
              <button
                type="button"
                onClick={() => toggleCollapsed(key)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-medium"
                aria-expanded={!isCollapsed}
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    isCollapsed && "-rotate-90",
                  )}
                />
                <span className="truncate">{itemTitle(item, index, noun)}</span>
              </button>
              {!disabled && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Выше"
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Ниже"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-red-300"
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </div>
            {!isCollapsed && (
              <div className="border-t border-border p-4">
                <ComponentBody
                  attrs={attrs}
                  item={item}
                  onChange={(next) => update(index, next)}
                  idPrefix={`${idPrefix}-${key}`}
                  renderInner={renderInner}
                />
              </div>
            )}
          </div>
        );
      })}
      {!disabled && (
        <Button
          type="button"
          variant="secondary"
          className="justify-self-start"
          onClick={() => onChange([...items, { [TEMP_KEY]: newTempKey() }])}
        >
          <Plus className="size-4 mr-1.5" />
          Добавить {noun.toLowerCase()}
        </Button>
      )}
      {items.length === 0 && disabled && <p className="text-sm text-muted-foreground">Пусто</p>}
    </div>
  );
}
