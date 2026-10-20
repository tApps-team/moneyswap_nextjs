"use client";

import { BarChart3, ExternalLink, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { CMS_BASE } from "@/cms/config/paths";
import { userDisplayName } from "@/cms/model/navigation";
import { useCmsSession } from "@/cms/model/session-context";
import { STAFF_KEY } from "@/shared/analytics/tracker";
import { cn } from "@/shared/lib";

/**
 * Продлеваем сессию один раз за вкладку браузера: так активный редактор
 * не вылетит посреди работы, а забытая вкладка всё равно истечёт.
 */
function useRenewSessionOnce() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("cms_renewed")) return;
      sessionStorage.setItem("cms_renewed", "1");
    } catch {
      // приватный режим без sessionStorage — просто продлеваем каждый раз
    }
    fetch(`${CMS_BASE}/api/auth/renew`, { method: "POST" }).catch(() => undefined);
  }, []);
}

/**
 * Браузер сотрудника помечается: его визиты на сайт по умолчанию не попадают
 * в статистику, чтобы правки и проверки менеджеров не искажали отчёты.
 */
function useMarkStaffBrowser() {
  useEffect(() => {
    try {
      localStorage.setItem(STAFF_KEY, "1");
    } catch {
      // без localStorage просто не помечаем
    }
  }, []);
}

async function logout() {
  try {
    sessionStorage.removeItem("cms_renewed");
  } catch {
    // ничего страшного
  }
  await fetch(`${CMS_BASE}/api/auth/logout`, { method: "POST" }).catch(() => undefined);
  window.location.href = `${CMS_BASE}/login`;
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { navigation, user } = useCmsSession();

  const isActive = (href: string) =>
    href === CMS_BASE ? pathname === CMS_BASE : pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-w-0",
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 h-16 shrink-0 border-b border-border">
        <span className="size-2 rounded-full bg-primary" />
        <span className="font-semibold tracking-tight">MoneySwap CMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 grid content-start gap-6" aria-label="Разделы CMS">
        <Link href={CMS_BASE} onClick={onNavigate} className={linkClass(isActive(CMS_BASE))}>
          <LayoutDashboard className="size-4 shrink-0" />
          Обзор
        </Link>
        <Link href={`${CMS_BASE}/stats`} onClick={onNavigate} className={cn(linkClass(isActive(`${CMS_BASE}/stats`)), "-mt-5")}>
          <BarChart3 className="size-4 shrink-0" />
          Статистика
        </Link>

        {navigation.map((group) => (
          <div key={group.key} className="grid gap-1">
            <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.uid}
                  href={item.href}
                  onClick={onNavigate}
                  title={item.title}
                  className={linkClass(isActive(item.href))}
                >
                  {Icon ? <Icon className="size-4 shrink-0" /> : <span className="size-4 shrink-0" />}
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {navigation.length === 0 && (
          <p className="px-3 text-sm text-muted-foreground">
            У вашей роли нет доступа к разделам. Обратитесь к администратору Strapi.
          </p>
        )}
      </nav>

      <div className="shrink-0 border-t border-border p-3 grid gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass(false)}
        >
          <ExternalLink className="size-4 shrink-0" />
          Открыть сайт
        </a>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 min-w-0">
          <div className="grid min-w-0 flex-1">
            <span className="truncate text-sm font-medium">{userDisplayName(user)}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.roles.map((r) => r.name).join(", ")}
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Выйти"
            aria-label="Выйти"
            className="grid place-items-center size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CmsShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useRenewSessionOnce();
  useMarkStaffBrowser();

  // Закрываем мобильное меню при переходе и блокируем прокрутку под ним.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Десктоп: постоянный сайдбар */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-border bg-card">
        <NavContent />
      </aside>

      {/* Мобильный: верхняя панель + выдвижное меню */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 border-b border-border bg-background/95 backdrop-blur">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          className="grid place-items-center size-9 -ml-1 rounded-lg hover:bg-secondary"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-semibold">MoneySwap CMS</span>
      </header>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Меню">
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-card border-r border-border shadow-xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
              className="absolute right-3 top-3.5 grid place-items-center size-9 rounded-lg hover:bg-secondary z-10"
            >
              <X className="size-5" />
            </button>
            <NavContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 max-w-[1600px]">{children}</main>
    </div>
  );
}
