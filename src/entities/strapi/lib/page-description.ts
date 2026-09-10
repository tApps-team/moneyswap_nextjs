import { stripHtmlToText } from "../ved";

/** Минимальная форма элемента динамической зоны, из которой берём текст. */
interface ParagraphLike {
  paragraph?: { content?: string | null } | null;
}

/**
 * Первый абзац страницы раздела в виде чистого текста.
 * Контент в Strapi лежит с HTML-разметкой («<br>», ссылки), поэтому теги вырезаем,
 * а длинный текст обрезаем по границе слова.
 */
export function getFirstParagraphText(
  content: ParagraphLike[] | undefined | null,
  limit = 200,
): string | null {
  const item = content?.find((entry) => entry?.paragraph?.content);
  const raw = item?.paragraph?.content;
  if (!raw) return null;

  const text = stripHtmlToText(raw);
  if (!text) return null;
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]+$/, "")}…`;
}
