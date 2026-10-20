"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cmsFetch } from "@/cms/api/client";
import { CmsNavItem, userDisplayName } from "@/cms/model/navigation";
import { useCmsSession } from "@/cms/model/session-context";
import { CmsPageHeader } from "../page-header";

/** Сколько записей в коллекции — одним лёгким запросом на одну запись. */
function EntriesCount({ uid }: { uid: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cms", "count", uid],
    queryFn: () =>
      cmsFetch<{ pagination: { total: number } }>(
        `content-manager/collection-types/${uid}?page=1&pageSize=1`,
      ),
    staleTime: 60 * 1000,
  });
  if (isLoading) return <span className="h-4 w-8 rounded bg-secondary animate-pulse" />;
  if (isError || !data) return null;
  return <span className="text-sm text-muted-foreground tabular-nums">{data.pagination.total}</span>;
}

function SectionCard({ item }: { item: CmsNavItem }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40 min-w-0"
    >
      <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-secondary text-primary">
        {Icon ? <Icon className="size-5" /> : null}
      </span>
      <span className="grid min-w-0 flex-1">
        <span className="truncate font-medium">{item.title}</span>
        {item.kind === "collectionType" ? (
          <EntriesCount uid={item.uid} />
        ) : (
          <span className="text-sm text-muted-foreground">Страница</span>
        )}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function CmsDashboard() {
  const { navigation, user } = useCmsSession();
  return (
    <>
      <CmsPageHeader
        title={`Здравствуйте, ${userDisplayName(user).split(" ")[0]}`}
        description="Разделы, доступные вашей роли"
      />
      <div className="grid gap-8">
        {navigation.map((group) => (
          <section key={group.key} className="grid gap-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {group.items.map((item) => (
                <SectionCard key={item.uid} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
