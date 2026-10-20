"use client";

import { RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/shared/ui";

/** Strapi недоступен или ответил ошибкой при загрузке раздела. */
export function CmsErrorState({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="grid gap-4 justify-items-center text-center max-w-md">
        <ServerCrash className="size-10 text-muted-foreground" />
        <div className="grid gap-1">
          <h1 className="text-lg font-semibold">Не удалось загрузить данные</h1>
          <p className="text-sm text-muted-foreground">
            Возможно, Strapi временно недоступен. Попробуйте ещё раз через минуту.
          </p>
          {process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-muted-foreground/70 break-all">{error.message}</p>
          )}
        </div>
        <Button onClick={reset} variant="secondary">
          <RefreshCw className="size-4 mr-2" />
          Повторить
        </Button>
      </div>
    </div>
  );
}
