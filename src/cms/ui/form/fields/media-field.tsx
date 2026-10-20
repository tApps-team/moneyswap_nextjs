"use client";

/* eslint-disable @next/next/no-img-element -- медиа из Strapi, оптимизатор Next не нужен */
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FileIcon, ImageOff, Loader2, Search, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CmsApiError } from "@/cms/api/client";
import { listFiles, uploadFile } from "@/cms/api/upload";
import { useCmsSession } from "@/cms/model/session-context";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { CmsMedia, mediaThumb } from "../../media";
import { Sheet } from "../../primitives/sheet";

export function Preview({ media, className }: { media: CmsMedia; className?: string }) {
  const { strapiUrl } = useCmsSession();
  const [failed, setFailed] = useState(false);
  const isImage = media.mime?.startsWith("image/") ?? true;
  const src = mediaThumb(strapiUrl, media);
  return (
    <span className={cn("grid place-items-center overflow-hidden rounded-lg bg-secondary", className)}>
      {isImage && src && !failed ? (
        <img
          src={src}
          alt={media.alternativeText ?? media.name ?? ""}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-contain"
        />
      ) : isImage ? (
        <ImageOff className="size-5 text-muted-foreground" />
      ) : (
        <FileIcon className="size-5 text-muted-foreground" />
      )}
    </span>
  );
}

const PAGE_SIZE = 24;

export function MediaLibrary({
  open,
  onOpenChange,
  multiple,
  imagesOnly,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  multiple: boolean;
  imagesOnly: boolean;
  onPick: (files: CmsMedia[]) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<CmsMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const files = useInfiniteQuery({
    queryKey: ["cms", "media", query, imagesOnly],
    queryFn: ({ pageParam }) => listFiles({ page: pageParam, pageSize: PAGE_SIZE, q: query, imagesOnly }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.pageCount ? last.pagination.page + 1 : undefined,
    enabled: open,
  });
  const items = useMemo(() => files.data?.pages.flatMap((p) => p.results) ?? [], [files.data]);

  const toggle = (file: CmsMedia) => {
    if (!multiple) return setPicked([file]);
    setPicked((prev) => (prev.some((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file]));
  };

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    try {
      const uploaded: CmsMedia[] = [];
      for (const file of Array.from(list)) uploaded.push(await uploadFile(file));
      await queryClient.invalidateQueries({ queryKey: ["cms", "media"] });
      setPicked((prev) => (multiple ? [...prev, ...uploaded] : uploaded.slice(-1)));
      toast({ title: uploaded.length > 1 ? `Загружено файлов: ${uploaded.length}` : "Файл загружен" });
    } catch (err) {
      toast({
        title: "Не удалось загрузить файл",
        description: err instanceof CmsApiError ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const close = (v: boolean) => {
    if (!v) setPicked([]);
    onOpenChange(v);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={close}
      title="Медиатека"
      className="sm:max-w-2xl"
      footer={
        <div className="flex items-center gap-2">
          <span className="mr-auto text-sm text-muted-foreground">
            {picked.length ? `Выбрано: ${picked.length}` : multiple ? "Можно выбрать несколько" : "Выберите файл"}
          </span>
          <Button variant="secondary" onClick={() => close(false)}>
            Отмена
          </Button>
          <Button
            disabled={!picked.length}
            onClick={() => {
              onPick(picked);
              close(false);
            }}
          >
            Выбрать
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени файла"
              className="h-10 pl-9"
            />
          </div>
          <input
            ref={fileInput}
            type="file"
            multiple={multiple}
            accept={imagesOnly ? "image/*" : undefined}
            className="hidden"
            onChange={(e) => upload(e.target.files)}
          />
          <Button variant="secondary" disabled={uploading} onClick={() => fileInput.current?.click()}>
            {uploading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
            Загрузить
          </Button>
        </div>

        {files.isLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Файлов не найдено</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items.map((file) => {
              const active = picked.some((f) => f.id === file.id);
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => toggle(file)}
                  title={file.name}
                  className={cn(
                    "group relative grid gap-1.5 rounded-xl border p-2 text-left transition-colors",
                    active ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50",
                  )}
                >
                  <Preview media={file} className="aspect-square w-full" />
                  <span className="truncate text-xs text-muted-foreground">{file.name}</span>
                  {active && (
                    <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {files.hasNextPage && (
          <Button variant="secondary" disabled={files.isFetchingNextPage} onClick={() => files.fetchNextPage()}>
            {files.isFetchingNextPage && <Loader2 className="size-4 animate-spin mr-2" />}
            Показать ещё
          </Button>
        )}
      </div>
    </Sheet>
  );
}

/** Поле медиа: одиночное (логотип, иконка) или множественное. */
export function MediaInput({
  value,
  onChange,
  multiple,
  allowedTypes,
  disabled,
}: {
  value: CmsMedia | CmsMedia[] | null;
  onChange: (v: CmsMedia | CmsMedia[] | null) => void;
  multiple?: boolean;
  allowedTypes?: string[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const imagesOnly = Boolean(allowedTypes?.length === 1 && allowedTypes[0] === "images");
  const list = multiple ? ((value as CmsMedia[]) ?? []) : value ? [value as CmsMedia] : [];

  const pick = (files: CmsMedia[]) =>
    multiple
      ? onChange([...list, ...files.filter((f) => !list.some((l) => l.id === f.id))])
      : onChange(files[0] ?? null);

  return (
    <>
      {multiple ? (
        <div className="flex flex-wrap gap-2">
          {list.map((m) => (
            <div key={m.id} className="relative">
              <Preview media={m} className="size-20" />
              {!disabled && (
                <button
                  type="button"
                  aria-label="Убрать файл"
                  onClick={() => onChange(list.filter((l) => l.id !== m.id))}
                  className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-card border border-border hover:bg-secondary"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}
          {!disabled && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-20 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
            >
              Добавить
            </button>
          )}
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border p-2">
          {list[0] ? (
            <Preview media={list[0]} className="size-14 shrink-0" />
          ) : (
            <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
              <ImageOff className="size-5" />
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {list[0]?.name ?? "Файл не выбран"}
          </span>
          {!disabled && (
            <div className="flex shrink-0 gap-1">
              <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
                {list[0] ? "Заменить" : "Выбрать"}
              </Button>
              {list[0] && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Убрать файл"
                  onClick={() => onChange(null)}
                  className="size-9"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      <MediaLibrary
        open={open}
        onOpenChange={setOpen}
        multiple={Boolean(multiple)}
        imagesOnly={imagesOnly}
        onPick={pick}
      />
    </>
  );
}
