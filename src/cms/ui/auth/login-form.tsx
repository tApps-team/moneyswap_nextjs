"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { CMS_BASE } from "@/cms/config/paths";
import { Button, Input, Label } from "@/shared/ui";

const REASONS: Record<string, string> = {
  expired: "Сессия истекла — войдите снова.",
};

/**
 * Куда вернуть после входа. Только внутренние адреса CMS: иначе параметр
 * next превращается в открытый редирект на чужой сайт.
 */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith(`${CMS_BASE}`) || raw.startsWith("//")) return CMS_BASE;
  if (raw.startsWith(`${CMS_BASE}/login`)) return CMS_BASE;
  return raw;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const reason = REASONS[params.get("reason") ?? ""];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`${CMS_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.message ?? "Не удалось войти");
        return;
      }
      router.replace(safeNext(params.get("next")));
      router.refresh();
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm grid gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-3 justify-items-center text-center">
        <span className="grid place-items-center size-12 rounded-full bg-secondary text-primary">
          <LockKeyhole className="size-5" />
        </span>
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">MoneySwap CMS</h1>
          <p className="text-sm text-muted-foreground">
            Вход с учётной записью админки Strapi
          </p>
        </div>
      </div>

      {reason && !error && (
        <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">{reason}</p>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cms-email">Email</Label>
          <Input
            id="cms-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cms-password">Пароль</Label>
          <Input
            id="cms-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="h-11 font-semibold">
        {pending && <Loader2 className="size-4 animate-spin mr-2" />}
        Войти
      </Button>
    </form>
  );
}
