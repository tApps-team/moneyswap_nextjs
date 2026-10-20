import { ReactNode } from "react";
import { cn } from "@/shared/lib";

/** Обёртка поля: подпись, звёздочка обязательности, подсказка и ошибка. */
export function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  aside,
  children,
  className,
}: {
  id?: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Элемент справа от подписи — например, кнопка генерации адреса. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5 min-w-0", className)}>
      <div className="flex items-center justify-between gap-2 min-h-5">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
