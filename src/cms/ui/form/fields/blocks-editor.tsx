"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- узлы Slate динамические, типизация через any локальна */
import {
  Bold,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { KeyboardEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseRange, createEditor, Descendant, Editor, Element as SlateElement, Node, Range, Transforms } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useSelected,
  useSlateStatic,
  withReact,
} from "slate-react";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { CmsMedia } from "../../media";
import { MediaLibrary, Preview } from "./media-field";

/**
 * Редактор поля Strapi типа `blocks`.
 *
 * Формат blocks — это документ Slate (на нём же построена штатная админка),
 * поэтому данные идут как есть, без конвертации. Набор инструментов —
 * ровно то, что умеет выводить сайт (sanitizeRichText в Strapi): абзацы,
 * заголовки, списки, цитаты, картинки, ссылки и жирный/курсив/подчёркнутый/
 * зачёркнутый. Блоки кода сайт не выводит — их тут нельзя создать, но
 * существующие сохраняются.
 */

type Mark = "bold" | "italic" | "underline" | "strikethrough";
type BlockKind = "paragraph" | "h2" | "h3" | "h4" | "quote";

const EMPTY: Descendant[] = [{ type: "paragraph", children: [{ type: "text", text: "" }] } as any];

/**
 * Узлы Slate → JSON для Strapi. Сайт выводит текст, только если у узла есть
 * `type: "text"` — Slate это поле сам не ставит, поэтому проставляем всем листьям.
 */
function toStrapi(nodes: Descendant[]): unknown[] {
  const walk = (node: any): any => {
    if (typeof node.text === "string") return { ...node, type: "text" };
    return { ...node, children: (node.children ?? []).map(walk) };
  };
  return nodes.map(walk);
}

/** Пустой документ (один пустой абзац) сохраняем как null. */
function isEmptyDoc(nodes: Descendant[]) {
  return (
    nodes.length === 1 &&
    (nodes[0] as any).type === "paragraph" &&
    Node.string(nodes[0]).trim() === "" &&
    !(nodes[0] as any).children?.some((c: any) => c.type === "link")
  );
}

function withStrapiElements<T extends Editor>(editor: T): T {
  const { isInline, isVoid } = editor;
  editor.isInline = (el: any) => el.type === "link" || isInline(el);
  editor.isVoid = (el: any) => el.type === "image" || isVoid(el);
  return editor;
}

const isMarkActive = (editor: Editor, mark: Mark) => Boolean((Editor.marks(editor) as any)?.[mark]);

const toggleMark = (editor: Editor, mark: Mark) => {
  if (isMarkActive(editor, mark)) Editor.removeMark(editor, mark);
  else Editor.addMark(editor, mark, true);
};

/**
 * Подтянуть выделение из DOM в модель Slate. Slate синхронизирует его
 * с задержкой (~100 мс), и быстрое «выделил → нажал Жирный» применяло бы
 * формат не к выделенному тексту, а к следующему набранному символу.
 */
const syncSelection = (editor: ReactEditor) => {
  const dom = typeof window !== "undefined" ? window.getSelection() : null;
  if (!dom || dom.rangeCount === 0) return;
  try {
    if (!ReactEditor.hasDOMNode(editor, dom.anchorNode as globalThis.Node)) return;
    const range = ReactEditor.toSlateRange(editor, dom, { exactMatch: false, suppressThrow: true });
    if (range) Transforms.select(editor, range);
  } catch {
    // выделение вне редактора — оставляем как есть
  }
};

/** Тип узла Slate. После сужения через isElement TS «теряет» поле type — читаем так. */
const typeOf = (n: unknown): string | undefined => (n as any)?.type;

/** Первый узел под выделением, подходящий под условие. */
const firstNode = (editor: Editor, match: (n: unknown) => boolean, mode?: "lowest"): any => {
  const entry = Editor.nodes(editor, { match: match as any, mode }).next().value;
  return entry?.[0];
};

const activeBlock = (editor: Editor): any =>
  firstNode(editor, (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) && typeOf(n) !== "list", "lowest");

const activeList = (editor: Editor): any => firstNode(editor, (n) => SlateElement.isElement(n) && typeOf(n) === "list");

const blockKindOf = (el: any): BlockKind | "list" | "other" => {
  if (!el) return "paragraph";
  if (el.type === "heading") return [2, 3, 4].includes(el.level) ? (`h${el.level}` as BlockKind) : "other";
  if (el.type === "list-item") return "list";
  if (el.type === "paragraph" || el.type === "quote") return el.type;
  return "other";
};

/** Снять список с выделенных пунктов — превратить их обратно в абзацы. */
const unwrapList = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: (n: any) => SlateElement.isElement(n) && typeOf(n) === "list", split: true });
  Transforms.setNodes(editor, { type: "paragraph" } as any, {
    match: (n: any) => SlateElement.isElement(n) && typeOf(n) === "list-item",
  });
};

const setBlock = (editor: Editor, kind: BlockKind) => {
  if (activeList(editor)) unwrapList(editor);
  const props =
    kind === "paragraph" || kind === "quote"
      ? { type: kind, level: undefined }
      : { type: "heading", level: Number(kind.slice(1)) };
  Transforms.setNodes(editor, props as any, {
    match: (n: any) => SlateElement.isElement(n) && Editor.isBlock(editor, n) && typeOf(n) !== "list",
  });
};

const toggleList = (editor: Editor, format: "ordered" | "unordered") => {
  const list = activeList(editor);
  if (list) {
    if (list.format === format) return unwrapList(editor);
    return Transforms.setNodes(editor, { format } as any, { match: (n: any) => n.type === "list" });
  }
  Transforms.setNodes(editor, { type: "list-item", level: undefined } as any, {
    match: (n: any) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  });
  Transforms.wrapNodes(editor, { type: "list", format, children: [] } as any, {
    match: (n: any) => SlateElement.isElement(n) && typeOf(n) === "list-item",
  });
};

const activeLink = (editor: Editor): any => firstNode(editor, (n) => SlateElement.isElement(n) && typeOf(n) === "link");

function ToolbarButton({
  active,
  disabled,
  onAction,
  onBeforeAction,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onAction: () => void;
  onBeforeAction?: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // mousedown, а не click: иначе редактор теряет выделение до срабатывания
      onMouseDown={(e) => {
        e.preventDefault();
        onBeforeAction?.();
        onAction();
      }}
      className={cn(
        "grid size-8 place-items-center rounded-md transition-colors disabled:opacity-40",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ImageElement({ attributes, children, element }: RenderElementProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();
  const image = (element as any).image as CmsMedia | undefined;
  return (
    <div {...attributes} className="my-2">
      <div contentEditable={false} className={cn("relative w-fit rounded-lg", selected && focused && "ring-2 ring-primary")}>
        {image ? <Preview media={image} className="h-40 w-auto min-w-40 max-w-full" /> : null}
        <button
          type="button"
          aria-label="Удалить изображение"
          onClick={() => Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) })}
          className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-card/90 text-muted-foreground hover:text-red-300"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;
  const el = element as any;
  switch (el.type) {
    case "heading": {
      const sizes: Record<number, string> = {
        1: "text-2xl",
        2: "text-xl",
        3: "text-lg",
        4: "text-base",
        5: "text-base",
        6: "text-sm",
      };
      return (
        <p {...attributes} className={cn("font-semibold mt-3 mb-1", sizes[el.level] ?? "text-lg")}>
          {children}
        </p>
      );
    }
    case "list":
      return el.format === "ordered" ? (
        <ol {...attributes} className="my-1 ml-6 list-decimal">
          {children}
        </ol>
      ) : (
        <ul {...attributes} className="my-1 ml-6 list-disc">
          {children}
        </ul>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "quote":
      return (
        <blockquote {...attributes} className="my-2 border-l-2 border-primary/60 pl-3 italic text-muted-foreground">
          {children}
        </blockquote>
      );
    case "code":
      return (
        <pre {...attributes} className="my-2 rounded-md bg-secondary p-3 font-mono text-xs">
          {children}
        </pre>
      );
    case "link":
      return (
        <a {...attributes} href={el.url} className="text-primary underline underline-offset-2" onClick={(e) => e.preventDefault()}>
          {children}
        </a>
      );
    case "image":
      return <ImageElement {...props} />;
    default:
      return (
        <p {...attributes} className="my-1">
          {children}
        </p>
      );
  }
}

function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
  const l = leaf as any;
  let out = children;
  if (l.bold) out = <strong>{out}</strong>;
  if (l.italic) out = <em>{out}</em>;
  if (l.underline) out = <u>{out}</u>;
  if (l.strikethrough) out = <s>{out}</s>;
  if (l.code) out = <code className="rounded bg-secondary px-1 font-mono text-xs">{out}</code>;
  return <span {...attributes}>{out}</span>;
}

const HOTKEYS: Record<string, Mark> = { b: "bold", i: "italic", u: "underline" };

export function BlocksEditor({
  value,
  onChange,
  disabled,
  invalid,
  id,
}: {
  value: unknown;
  onChange: (v: unknown[] | null) => void;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
}) {
  const editor = useMemo(() => withStrapiElements(withHistory(withReact(createEditor()))), []);
  const initial = useMemo<Descendant[]>(
    () => (Array.isArray(value) && value.length ? (value as Descendant[]) : EMPTY),
    // Начальное значение берём один раз; внешние изменения — эффектом ниже.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Последнее, что редактор отдал наружу. Если значение пришло извне
  // (например, запись перечитали после сохранения) — переинициализируем.
  const lastEmitted = useRef(JSON.stringify(value ?? null));
  useEffect(() => {
    const incoming = JSON.stringify(value ?? null);
    if (incoming === lastEmitted.current) return;
    lastEmitted.current = incoming;
    editor.children = Array.isArray(value) && value.length ? (value as Descendant[]) : EMPTY;
    editor.selection = null;
    HistoryEditor.withoutSaving(editor as HistoryEditor, () => editor.onChange());
  }, [value, editor]);

  const [, forceToolbar] = useState(0);
  const sync = useCallback(() => syncSelection(editor), [editor]);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const savedSelection = useRef<BaseRange | null>(null);
  const [mediaOpen, setMediaOpen] = useState(false);

  const handleChange = useCallback(
    (nodes: Descendant[]) => {
      forceToolbar((n) => n + 1);
      // Смена выделения — не правка документа.
      if (!editor.operations.some((op) => op.type !== "set_selection")) return;
      const out = isEmptyDoc(nodes) ? null : toStrapi(nodes);
      lastEmitted.current = JSON.stringify(out);
      onChange(out);
    },
    [editor, onChange],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && HOTKEYS[e.key.toLowerCase()]) {
      e.preventDefault();
      syncSelection(editor);
      toggleMark(editor, HOTKEYS[e.key.toLowerCase()]);
    }
  };

  const block = blockKindOf(activeBlock(editor));
  const list = activeList(editor);
  const link = activeLink(editor);
  const hasSelection = Boolean(editor.selection && !Range.isCollapsed(editor.selection));

  const openLink = () => {
    savedSelection.current = editor.selection;
    setLinkUrl(link?.url ?? "https://");
  };

  const applyLink = () => {
    const url = (linkUrl ?? "").trim();
    if (savedSelection.current) Transforms.select(editor, savedSelection.current);
    if (activeLink(editor)) {
      Transforms.setNodes(editor, { url } as any, { match: (n: any) => n.type === "link" });
    } else if (url && editor.selection) {
      if (Range.isCollapsed(editor.selection)) {
        Transforms.insertNodes(editor, { type: "link", url, children: [{ type: "text", text: url }] } as any);
      } else {
        Transforms.wrapNodes(editor, { type: "link", url, children: [] } as any, { split: true });
        Transforms.collapse(editor, { edge: "end" });
      }
    }
    setLinkUrl(null);
    ReactEditor.focus(editor as ReactEditor);
  };

  const removeLink = () => {
    if (savedSelection.current) Transforms.select(editor, savedSelection.current);
    Transforms.unwrapNodes(editor, { match: (n: any) => n.type === "link" });
    setLinkUrl(null);
  };

  const insertImage = (files: CmsMedia[]) => {
    if (savedSelection.current) Transforms.select(editor, savedSelection.current);
    for (const image of files) {
      Transforms.insertNodes(editor, { type: "image", image, children: [{ type: "text", text: "" }] } as any);
    }
    // После картинки — пустой абзац, чтобы было куда продолжить писать.
    Transforms.insertNodes(editor, { type: "paragraph", children: [{ type: "text", text: "" }] } as any);
  };

  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border border-input bg-background",
        invalid && "border-red-400/70",
        disabled && "opacity-60",
      )}
    >
      <Slate editor={editor} initialValue={initial} onChange={handleChange}>
        {!disabled && (
          <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
            <ToolbarButton onBeforeAction={sync} label="Абзац" active={block === "paragraph"} onAction={() => setBlock(editor, "paragraph")}>
              <Pilcrow className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Заголовок 2" active={block === "h2"} onAction={() => setBlock(editor, "h2")}>
              <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Заголовок 3" active={block === "h3"} onAction={() => setBlock(editor, "h3")}>
              <Heading3 className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Заголовок 4" active={block === "h4"} onAction={() => setBlock(editor, "h4")}>
              <Heading4 className="size-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton onBeforeAction={sync} label="Жирный (⌘B)" active={isMarkActive(editor, "bold")} onAction={() => toggleMark(editor, "bold")}>
              <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Курсив (⌘I)" active={isMarkActive(editor, "italic")} onAction={() => toggleMark(editor, "italic")}>
              <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Подчёркнутый (⌘U)"
              active={isMarkActive(editor, "underline")}
              onAction={() => toggleMark(editor, "underline")}
            >
              <Underline className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Зачёркнутый"
              active={isMarkActive(editor, "strikethrough")}
              onAction={() => toggleMark(editor, "strikethrough")}
            >
              <Strikethrough className="size-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton onBeforeAction={sync} label="Маркированный список" active={list?.format === "unordered"} onAction={() => toggleList(editor, "unordered")}>
              <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Нумерованный список" active={list?.format === "ordered"} onAction={() => toggleList(editor, "ordered")}>
              <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarButton onBeforeAction={sync} label="Цитата" active={block === "quote"} onAction={() => setBlock(editor, "quote")}>
              <Quote className="size-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton onBeforeAction={sync} label="Ссылка" active={Boolean(link)} disabled={!link && !hasSelection && !editor.selection} onAction={openLink}>
              <Link2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Изображение"
              onAction={() => {
                savedSelection.current = editor.selection;
                setMediaOpen(true);
              }}
            >
              <ImagePlus className="size-4" />
            </ToolbarButton>
            <span className="ml-auto flex">
              <ToolbarButton onBeforeAction={sync} label="Отменить (⌘Z)" onAction={() => (editor as HistoryEditor).undo()}>
                <Undo2 className="size-4" />
              </ToolbarButton>
              <ToolbarButton onBeforeAction={sync} label="Повторить (⇧⌘Z)" onAction={() => (editor as HistoryEditor).redo()}>
                <Redo2 className="size-4" />
              </ToolbarButton>
            </span>
          </div>
        )}

        {linkUrl !== null && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-2 py-2">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
                if (e.key === "Escape") setLinkUrl(null);
              }}
              placeholder="https://… или /ved"
              className="h-8 min-w-0 flex-1"
            />
            <Button type="button" size="sm" onClick={applyLink}>
              Применить
            </Button>
            {link && (
              <Button type="button" size="sm" variant="ghost" onClick={removeLink}>
                <Unlink className="size-4 mr-1.5" />
                Убрать
              </Button>
            )}
            <Button type="button" size="sm" variant="ghost" onClick={() => setLinkUrl(null)}>
              Отмена
            </Button>
          </div>
        )}

        <Editable
          id={id}
          readOnly={disabled}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="Начните писать…"
          spellCheck
          className="min-h-[140px] px-3 py-2 text-sm leading-relaxed outline-none [&_[data-slate-placeholder]]:!opacity-40"
        />
      </Slate>

      <MediaLibrary open={mediaOpen} onOpenChange={setMediaOpen} multiple imagesOnly onPick={insertImage} />
    </div>
  );
}
