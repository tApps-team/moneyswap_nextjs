import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CMS_BASE, CMS_COOKIE, loadSession } from "@/cms/server/strapi-admin";
import { CmsSessionProvider } from "@/cms/model/session-context";
import { CmsShell } from "@/cms/ui/shell/cms-shell";

// Каждый запрос — с живой проверкой токена и прав в Strapi: роль могли
// поменять или пользователя отключить, а кэшировать это нельзя.
export const dynamic = "force-dynamic";

export default async function CmsAppLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(CMS_COOKIE)?.value;
  if (!token) redirect(`${CMS_BASE}/login`);

  const session = await loadSession(token);
  // Серверный компонент не может удалить cookie — это делает маршрут выхода.
  if (!session) redirect(`${CMS_BASE}/api/auth/logout?reason=expired`);

  return (
    <CmsSessionProvider session={session}>
      <CmsShell>{children}</CmsShell>
    </CmsSessionProvider>
  );
}
