"use client";

import { Wand2 } from "lucide-react";
import { ChangeEvent } from "react";
import { cn } from "@/shared/lib";
import { Input, Switch, Textarea } from "@/shared/ui";
import { slugify } from "../slugify";

const inputClass = "h-10";

export function TextInput({
  id,
  value,
  onChange,
  disabled,
  maxLength,
  type = "text",
  invalid,
}: {
  id: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled?: boolean;
  maxLength?: number;
  type?: string;
  invalid?: boolean;
}) {
  return (
    <Input
      id={id}
      type={type}
      value={(value as string) ?? ""}
      maxLength={maxLength}
      disabled={disabled}
      aria-invalid={invalid}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className={cn(inputClass, invalid && "border-red-400/70")}
    />
  );
}

/** Кнопка «сгенерировать адрес из названия» рядом с подписью поля slug. */
export function SlugGenerateButton({ source, onGenerate }: { source: unknown; onGenerate: (v: string) => void }) {
  const text = typeof source === "string" ? source : "";
  return (
    <button
      type="button"
      disabled={!text.trim()}
      onClick={() => onGenerate(slugify(text))}
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline"
    >
      <Wand2 className="size-3.5" />
      Из названия
    </button>
  );
}

export function TextAreaInput({
  id,
  value,
  onChange,
  disabled,
  invalid,
}: {
  id: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <Textarea
      id={id}
      value={(value as string) ?? ""}
      disabled={disabled}
      aria-invalid={invalid}
      rows={4}
      onChange={(e) => onChange(e.target.value)}
      className={cn("min-h-[96px] resize-y py-2", invalid && "border-red-400/70")}
    />
  );
}

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  integer,
  invalid,
}: {
  id: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled?: boolean;
  integer?: boolean;
  invalid?: boolean;
}) {
  return (
    <Input
      id={id}
      // text + inputMode, а не type=number: так можно ввести «1,5» и не потерять
      // значение при прокрутке колёсиком над полем.
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      value={value === null || value === undefined ? "" : String(value)}
      disabled={disabled}
      aria-invalid={invalid}
      onChange={(e) => {
        const v = e.target.value.replace(integer ? /[^\d-]/g : /[^\d.,-]/g, "");
        onChange(v);
      }}
      className={cn(inputClass, "tabular-nums", invalid && "border-red-400/70")}
    />
  );
}

export function BooleanInput({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: unknown;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex h-10 items-center gap-3">
      <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} disabled={disabled} />
      <span className="text-sm text-muted-foreground">{value ? "Да" : "Нет"}</span>
    </div>
  );
}

export function EnumInput({
  id,
  value,
  options,
  onChange,
  disabled,
  required,
  invalid,
}: {
  id: string;
  value: unknown;
  options: { value: string; label: string }[];
  onChange: (v: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      value={(value as string) ?? ""}
      disabled={disabled}
      aria-invalid={invalid}
      onChange={(e) => onChange(e.target.value || null)}
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50",
        invalid && "border-red-400/70",
      )}
    >
      <option value="" disabled={required}>
        — не выбрано —
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** ISO из Strapi ↔ значение для input[type=datetime-local] в локальном времени. */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function DateInput({
  id,
  value,
  onChange,
  withTime,
  disabled,
}: {
  id: string;
  value: unknown;
  onChange: (v: string | null) => void;
  withTime?: boolean;
  disabled?: boolean;
}) {
  const str = typeof value === "string" ? value : "";
  return (
    <Input
      id={id}
      type={withTime ? "datetime-local" : "date"}
      disabled={disabled}
      value={withTime ? (str ? toLocalInput(str) : "") : str.slice(0, 10)}
      onChange={(e) => {
        const v = e.target.value;
        if (!v) return onChange(null);
        onChange(withTime ? new Date(v).toISOString() : v);
      }}
      className={inputClass}
    />
  );
}
