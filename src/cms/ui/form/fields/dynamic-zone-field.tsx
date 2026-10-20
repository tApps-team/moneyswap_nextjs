"use client";

import { AlignLeft, ChevronDown, ChevronUp, HelpCircle, MousePointerClick, Plus, Quote, Trash2 } from "lucide-react";
import { useState } from "react";
import { CmsAttributes, SYSTEM_FIELDS } from "@/cms/schema/attributes";
import { cn } from "@/shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { FormValues, newTempKey, TEMP_KEY } from "../form-model";
import { RenderInner } from "./component-field";

const ICONS: Record<string, typeof AlignLeft> = {
  "article.paragraph-content": AlignLeft,
  "article.quote": Quote,
  "article.custom-button": MousePointerClick,
  "article.accordion": HelpCircle,
};

/** Короткое превью блока в заголовке карточки. */
function preview(item: FormValues): string {
  for (const key of ["title", "question", "content", "button_title"]) {
    const v = item[key];
    if (typeof v === "string" && v.trim()) return v.trim().slice(0, 90);
  }
  // У абзаца текст в blocks — берём первые слова первого абзаца.
  const blocks = item.content;
  if (Array.isArray(blocks)) {
    const text = JSON.stringify(blocks).match(/"text":"([^"]{1,90})/);
    if (text) return text[1];
  }
  return "";
}

/**
 * Dynamic zone: упорядоченный список блоков разных типов.
 * У существующих блоков сохраняется id — Strapi обновляет их на месте,
 * а блоки, которых нет в списке, удаляет.
 */
export function DynamicZoneInput({
  components,
  value,
  onChange,
  componentAttrs,
  componentTitle,
  disabled,
  idPrefix,
  renderInner,
}: {
  components: string[];
  value: FormValues[] | null;
  onChange: (v: FormValues[]) => void;
  componentAttrs: (uid: string) => CmsAttributes | undefined;
  componentTitle: (uid: string) => string;
  disabled?: boolean;
  idPrefix: string;
  renderInner: (attrs: CmsAttributes, componentUid: string) => RenderInner;
}) {
  const items = value ?? [];
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const keyOf = (item: FormValues) => String(item[TEMP_KEY]);

  const update = (index: number, next: FormValues) => onChange(items.map((it, i) => (i === index ? next : it)));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = (uid: string, at = items.length) => {
    const next = [...items];
    next.splice(at, 0, { [TEMP_KEY]: newTempKey(), __component: uid });
    onChange(next);
  };
  const toggleCollapsed = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const addMenu = (label: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" className="justify-self-start">
          <Plus className="size-4 mr-1.5" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {components.map((uid) => {
          const Icon = ICONS[uid] ?? AlignLeft;
          return (
            <DropdownMenuItem key={uid} onSelect={() => add(uid)}>
              <Icon className="size-4 mr-2" />
              {componentTitle(uid)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="grid min-w-0 gap-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Блоков пока нет</p>}
      {items.map((item, index) => {
        const uid = String(item.__component);
        const attrs = componentAttrs(uid);
        const key = keyOf(item);
        const isCollapsed = collapsed.has(key);
        const Icon = ICONS[uid] ?? AlignLeft;
        const text = preview(item);
        return (
          <div key={key} className="min-w-0 rounded-xl border border-border bg-background/40">
            <div className="flex items-center gap-1 px-3 py-2">
              <button
                type="button"
                onClick={() => toggleCollapsed(key)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                aria-expanded={!isCollapsed}
              >
                <ChevronDown className={cn("size-4 shrink-0 transition-transform", isCollapsed && "-rotate-90")} />
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="shrink-0 font-medium">{componentTitle(uid)}</span>
                {text && <span className="min-w-0 truncate text-muted-foreground">— {text}</span>}
              </button>
              {!disabled && (
                <>
                  <Button type="button" size="icon" variant="ghost" className="size-8" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Выше">
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
                    aria-label="Удалить блок"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </div>
            {!isCollapsed && attrs && (
              <div className="grid min-w-0 gap-4 border-t border-border p-4 sm:grid-cols-2">
                {Object.keys(attrs)
                  .filter((name) => !SYSTEM_FIELDS.includes(name))
                  .map((name) => (
                    <div
                      key={name}
                      className={cn(
                        "min-w-0",
                        ["text", "blocks", "media", "component", "relation"].includes(attrs[name].type) && "sm:col-span-2",
                      )}
                    >
                      {renderInner(attrs, uid)({
                        name,
                        value: item[name],
                        onChange: (v) => update(index, { ...item, [name]: v }),
                        idPrefix: `${idPrefix}-${key}`,
                      })}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
      {!disabled && addMenu("Добавить блок")}
    </div>
  );
}
