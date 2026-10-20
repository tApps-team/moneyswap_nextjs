"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CmsApiError } from "@/cms/api/client";
import { bulkAction, BulkAction, CmsEntry, listEntries } from "@/cms/api/content-manager";
import { useCmsSession } from "@/cms/model/session-context";
import { isSortable } from "@/cms/schema/attributes";
import { attributeOf, CollectionModel } from "@/cms/schema/collection";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/shared/ui";
import { CmsPageHeader } from "../page-header";
import { CmsCheckbox } from "../primitives/checkbox";
import { ConfirmDialog } from "../primitives/confirm";
import { BulkRelationsSheet, bulkRelationFields } from "../relations/bulk-relations-sheet";
import { CellValue, StatusBadge } from "./cell";
import { FilterPanel } from "./filter-panel";
import { activeFilterCount, FilterState, STATUS_FILTER, toStrapiFilters } from "./filters";
import { PAGE_SIZES, useListState } from "./use-list-state";

function useDebounced<T>(value: T, delay = 350): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/** Выбранные колонки — на устройстве пользователя, отдельно для каждой коллекции. */
function useColumns(model: CollectionModel) {
  const key = `cms:cols:${model.uid}`;
  const [columns, setColumns] = useState<string[]>(model.defaultColumns);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (Array.isArray(saved)) {
        const valid = saved.filter((c: string) => model.availableColumns.includes(c) || c === model.mainField);
        if (valid.length) setColumns(valid);
      }
    } catch {
      // нет доступа к localStorage — работаем с колонками по умолчанию
    }
  }, [key, model.availableColumns, model.mainField]);

  const save = (next: string[]) => {
    setColumns(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // не критично
    }
  };
  const toggle = (field: string) =>
    save(
      columns.includes(field)
        ? columns.filter((c) => c !== field)
        : model.availableColumns.filter((c) => c === field || columns.includes(c)),
    );
  const reset = () => save(model.defaultColumns);
  return { columns, toggle, reset };
}

/** Подписи активных фильтров — для чипов над списком. */
function filterChips(model: CollectionModel, filters: FilterState) {
  return Object.entries(filters).map(([field, v]) => {
    if (field === STATUS_FILTER && v.kind === "status") {
      return { field, label: `Статус: ${v.value === "draft" ? "черновик" : "опубликовано"}` };
    }
    const name = model.fieldLabel(field);
    if (v.kind === "bool") return { field, label: `${name}: ${v.value ? "да" : "нет"}` };
    if (v.kind === "range") return { field, label: `${name}: ${v.min ?? "…"} – ${v.max ?? "…"}` };
    if (v.kind === "in") {
      const attr = attributeOf(model, field);
      if (attr?.type === "enumeration" && v.values.length <= 2) {
        return { field, label: `${name}: ${v.values.map((x) => model.enumLabel(field, String(x))).join(", ")}` };
      }
      return { field, label: `${name}: ${v.values.length}` };
    }
    return { field, label: name };
  });
}

const BULK_TEXT: Record<BulkAction, { done: (n: number) => string; error: string }> = {
  bulkPublish: { done: (n) => `Опубликовано: ${n}`, error: "Не удалось опубликовать" },
  bulkUnpublish: { done: (n) => `Снято с публикации: ${n}`, error: "Не удалось снять с публикации" },
  bulkDelete: { done: (n) => `Удалено: ${n}`, error: "Не удалось удалить" },
};

export function CollectionList({ model, href }: { model: CollectionModel; href: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { ability, strapiUrl } = useCmsSession();
  const { state, update } = useListState();
  const { columns, toggle: toggleColumn, reset: resetColumns } = useColumns(model);

  const [search, setSearch] = useState(state.q);
  const debouncedSearch = useDebounced(search);
  useEffect(() => {
    if (debouncedSearch !== state.q) update({ q: debouncedSearch });
    // update меняется вместе с URL — следим только за текстом поиска
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Запоминаем вид списка — карточка записи вернёт к нему кнопкой «назад».
  useEffect(() => {
    try {
      sessionStorage.setItem(`cms:list:${model.uid}`, window.location.pathname + window.location.search);
    } catch {
      // без sessionStorage просто вернёмся к списку по умолчанию
    }
  }, [model.uid, state]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [relationsOpen, setRelationsOpen] = useState(false);

  const strapiFilters = useMemo(
    () => toStrapiFilters(state.filters, (f) => attributeOf(model, f)),
    [state.filters, model],
  );

  const queryKey = ["cms", "list", model.uid, state.page, state.pageSize, state.sort, state.q, strapiFilters];
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      listEntries(model.uid, {
        page: state.page,
        pageSize: state.pageSize,
        sort: state.sort,
        q: state.q,
        filters: strapiFilters,
      }),
    placeholderData: keepPreviousData,
  });

  // Сменилась выборка — выделение больше не относится к видимым записям.
  useEffect(() => setSelected(new Set()), [state.page, state.pageSize, state.sort, state.q, strapiFilters]);

  const entries = data?.results ?? [];
  const pagination = data?.pagination;

  const bulk = useMutation({
    mutationFn: ({ action, ids }: { action: BulkAction; ids: number[] }) => bulkAction(model.uid, action, ids),
    onSuccess: (res, { action }) => {
      toast({ title: BULK_TEXT[action].done(res.count) });
      setSelected(new Set());
      setConfirmDelete(false);
      queryClient.invalidateQueries({ queryKey: ["cms", "list", model.uid] });
      queryClient.invalidateQueries({ queryKey: ["cms", "count", model.uid] });
    },
    onError: (err, { action }) => {
      toast({
        title: BULK_TEXT[action].error,
        description: err instanceof CmsApiError ? err.message : undefined,
        variant: "destructive",
      });
    },
  });

  const canCreate = ability.can("create", model.uid);
  const canPublish = model.hasDraftAndPublish && ability.can("publish", model.uid);
  const canDelete = ability.can("delete", model.uid);
  const canBulkRelations =
    ability.can("update", model.uid) && bulkRelationFields(model, ability.fields("update", model.uid)).length > 0;
  const canBulk = canPublish || canDelete || canBulkRelations;

  const [sortField, sortDir] = state.sort.split(":");
  const onSort = (field: string) => {
    const attr = attributeOf(model, field);
    if (!attr || !isSortable(field, attr)) return;
    if (sortField === field) update({ sort: `${field}:${sortDir === "ASC" ? "DESC" : "ASC"}` });
    else update({ sort: `${field}:${attr.type === "datetime" ? "DESC" : "ASC"}` });
  };

  const allOnPage = entries.length > 0 && entries.every((e) => selected.has(e.id));
  const togglePage = () =>
    setSelected(allOnPage ? new Set() : new Set(entries.map((e) => e.id)));
  const toggleRow = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openEntry = (entry: CmsEntry) => router.push(`${href}/${entry.id}`);
  const chips = filterChips(model, state.filters);
  const removeFilter = (field: string) => {
    const next = { ...state.filters };
    delete next[field];
    update({ filters: next });
  };

  const mediaColumn = columns.find((c) => model.attributes[c]?.type === "media");
  const secondaryColumns = columns.filter(
    (c) => c !== model.mainField && c !== mediaColumn && c !== "publishedAt",
  );

  const filtersCount = activeFilterCount(state.filters);
  const hasConditions = Boolean(state.q) || filtersCount > 0;

  return (
    <>
      <CmsPageHeader
        title={model.title}
        description={
          pagination
            ? hasConditions
              ? `Найдено: ${pagination.total}`
              : `Всего записей: ${pagination.total}`
            : " "
        }
        actions={
          canCreate && (
            <Button asChild>
              <Link href={`${href}/new`}>
                <Plus className="size-4 mr-1.5" />
                Создать
              </Link>
            </Button>
          )
        }
      />

      {/* Панель инструментов */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, адресу и другим текстовым полям"
            className="h-10 pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setFiltersOpen(true)} className="flex-1 sm:flex-none">
            <SlidersHorizontal className="size-4 mr-2" />
            Фильтры
            {filtersCount > 0 && (
              <span className="ml-2 grid min-w-5 h-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {filtersCount}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="hidden lg:inline-flex">
                <Columns3 className="size-4 mr-2" />
                Колонки
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-96 w-64 overflow-y-auto">
              <DropdownMenuLabel>Колонки таблицы</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {model.availableColumns.map((field) => (
                <DropdownMenuCheckboxItem
                  key={field}
                  checked={columns.includes(field)}
                  disabled={field === model.mainField}
                  onCheckedChange={() => toggleColumn(field)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {model.fieldLabel(field)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <button
                type="button"
                onClick={resetColumns}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-secondary"
              >
                Вернуть по умолчанию
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => refetch()}
            aria-label="Обновить"
            title="Обновить"
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Активные фильтры */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {chips.map((chip) => (
            <span
              key={chip.field}
              className="inline-flex items-center gap-1 rounded-full bg-secondary py-1 pl-3 pr-1 text-xs"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeFilter(chip.field)}
                aria-label={`Убрать фильтр «${chip.label}»`}
                className="grid size-5 place-items-center rounded-full hover:bg-accent"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => update({ filters: {} })}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Сбросить все
          </button>
        </div>
      )}

      {/* Массовые действия */}
      {canBulk && selected.size > 0 && (
        <div className="sticky top-14 lg:top-2 z-20 mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-card/95 px-3 py-2 backdrop-blur">
          <span className="text-sm font-medium mr-auto">Выбрано: {selected.size}</span>
          {canPublish && (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={bulk.isPending}
                onClick={() => bulk.mutate({ action: "bulkPublish", ids: Array.from(selected) })}
              >
                <Eye className="size-4 mr-1.5" />
                Опубликовать
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={bulk.isPending}
                onClick={() => bulk.mutate({ action: "bulkUnpublish", ids: Array.from(selected) })}
              >
                <EyeOff className="size-4 mr-1.5" />
                Снять
              </Button>
            </>
          )}
          {canBulkRelations && (
            <Button size="sm" variant="secondary" disabled={bulk.isPending} onClick={() => setRelationsOpen(true)}>
              <Link2 className="size-4 mr-1.5" />
              Связи…
            </Button>
          )}
          {canDelete && (
            <Button size="sm" variant="destructive" disabled={bulk.isPending} onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4 mr-1.5" />
              Удалить
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Отменить
          </Button>
        </div>
      )}

      {isError ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-border py-16 text-center px-4">
          <p className="text-sm text-muted-foreground">
            Не удалось загрузить список{error instanceof CmsApiError ? `: ${error.message}` : ""}
          </p>
          <Button variant="secondary" onClick={() => refetch()}>
            Повторить
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center px-4">
          <p className="text-sm text-muted-foreground">
            {hasConditions ? "По заданным условиям ничего не найдено" : "Записей пока нет"}
          </p>
          {hasConditions && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                update({ q: "", filters: {} });
              }}
            >
              Сбросить поиск и фильтры
            </Button>
          )}
        </div>
      ) : (
        <div className={cn("transition-opacity", isFetching && "opacity-60")}>
          {/* Десктоп: таблица */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  {canBulk && (
                    <th className="w-10 px-3 py-3">
                      <CmsCheckbox checked={allOnPage} onCheckedChange={togglePage} aria-label="Выбрать все на странице" />
                    </th>
                  )}
                  {columns.map((field) => {
                    const attr = attributeOf(model, field);
                    const sortable = attr && isSortable(field, attr);
                    const active = sortField === field;
                    return (
                      <th key={field} className="px-3 py-3 font-medium whitespace-nowrap">
                        {sortable ? (
                          <button
                            type="button"
                            onClick={() => onSort(field)}
                            className={cn(
                              "inline-flex items-center gap-1 uppercase hover:text-foreground",
                              active && "text-primary",
                            )}
                          >
                            {model.fieldLabel(field)}
                            {active ? (
                              sortDir === "ASC" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
                            ) : (
                              <ArrowUpDown className="size-3.5 opacity-40" />
                            )}
                          </button>
                        ) : (
                          model.fieldLabel(field)
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => openEntry(entry)}
                    className={cn(
                      "cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/50",
                      selected.has(entry.id) && "bg-primary/5",
                    )}
                  >
                    {canBulk && (
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <CmsCheckbox
                          checked={selected.has(entry.id)}
                          onCheckedChange={() => toggleRow(entry.id)}
                          aria-label="Выбрать запись"
                        />
                      </td>
                    )}
                    {columns.map((field) => (
                      <td
                        key={field}
                        className={cn(
                          "px-3 py-2.5 align-middle",
                          field === model.mainField ? "font-medium max-w-[320px]" : "max-w-[240px]",
                        )}
                      >
                        <CellValue
                          field={field}
                          value={entry[field]}
                          attribute={attributeOf(model, field)}
                          enumLabel={model.enumLabel}
                          strapiUrl={strapiUrl}
                          owner={{ uid: model.uid, id: entry.id }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Телефон и планшет: карточки */}
          <div className="grid gap-2 lg:hidden">
            {canBulk && (
              <div className="flex items-center gap-3 px-1 py-1 text-sm text-muted-foreground">
                <CmsCheckbox id="cms-select-page" checked={allOnPage} onCheckedChange={togglePage} />
                <label htmlFor="cms-select-page">Выбрать все на странице</label>
              </div>
            )}
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex gap-3 rounded-xl border border-border bg-card p-3",
                  selected.has(entry.id) && "border-primary/40 bg-primary/5",
                )}
              >
                {canBulk && (
                  <div className="pt-0.5">
                    <CmsCheckbox checked={selected.has(entry.id)} onCheckedChange={() => toggleRow(entry.id)} />
                  </div>
                )}
                <button type="button" onClick={() => openEntry(entry)} className="grid min-w-0 flex-1 gap-2 text-left">
                  <div className="flex items-start gap-3 min-w-0">
                    {mediaColumn && (
                      <CellValue
                        field={mediaColumn}
                        value={entry[mediaColumn]}
                        attribute={attributeOf(model, mediaColumn)}
                        enumLabel={model.enumLabel}
                        strapiUrl={strapiUrl}
                      />
                    )}
                    <div className="grid min-w-0 flex-1 gap-1">
                      <span className="font-medium break-words">
                        {model.entryLabel(entry)}
                      </span>
                      {model.hasDraftAndPublish && (
                        <span>
                          <StatusBadge publishedAt={entry.publishedAt} />
                        </span>
                      )}
                    </div>
                  </div>
                  {secondaryColumns.length > 0 && (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      {secondaryColumns.slice(0, 6).map((field) => (
                        <div key={field} className="grid gap-0.5 min-w-0">
                          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {model.fieldLabel(field)}
                          </dt>
                          <dd className="min-w-0">
                            <CellValue
                              field={field}
                              value={entry[field]}
                              attribute={attributeOf(model, field)}
                              enumLabel={model.enumLabel}
                              strapiUrl={strapiUrl}
                              owner={{ uid: model.uid, id: entry.id }}
                            />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Пагинация */}
      {pagination && pagination.total > 0 && (
        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>
              {(pagination.page - 1) * pagination.pageSize + 1}–
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} из {pagination.total}
            </span>
            <select
              value={state.pageSize}
              onChange={(e) => update({ pageSize: Number(e.target.value) })}
              aria-label="Записей на странице"
              className="h-9 rounded-md border border-input bg-background px-2 text-foreground"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  по {s}
                </option>
              ))}
            </select>
          </div>
          {pagination.pageCount > 1 && (
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <Button
                variant="secondary"
                size="icon"
                disabled={state.page <= 1}
                onClick={() => update({ page: state.page - 1 })}
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="px-3 tabular-nums">
                {state.page} / {pagination.pageCount}
              </span>
              <Button
                variant="secondary"
                size="icon"
                disabled={state.page >= pagination.pageCount}
                onClick={() => update({ page: state.page + 1 })}
                aria-label="Следующая страница"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <FilterPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        model={model}
        value={state.filters}
        onApply={(filters) => update({ filters })}
      />

      {canBulkRelations && (
        <BulkRelationsSheet
          open={relationsOpen}
          onOpenChange={setRelationsOpen}
          model={model}
          entries={entries.filter((e) => selected.has(e.id))}
          onDone={() => {
            queryClient.invalidateQueries({ queryKey: ["cms", "list", model.uid] });
            queryClient.invalidateQueries({ queryKey: ["cms", "entry", model.uid] });
          }}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Удалить записи: ${selected.size}?`}
        description="Записи будут удалены из Strapi вместе со связями. Отменить это нельзя."
        confirmLabel="Удалить"
        destructive
        pending={bulk.isPending}
        onConfirm={() => bulk.mutate({ action: "bulkDelete", ids: Array.from(selected) })}
      />
      {bulk.isPending && <Loader2 className="fixed bottom-6 right-6 size-6 animate-spin text-primary" />}
    </>
  );
}

