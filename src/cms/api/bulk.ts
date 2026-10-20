import { updateEntry } from "./entries";

/**
 * Прикрепить и/или открепить записи справочника у одной записи.
 * Идёт обычным PUT Content Manager — тем же путём, что и сохранение формы,
 * поэтому срабатывают вебхуки и ревалидация сайта.
 */
export function updateRelation(
  uid: string,
  id: number,
  field: string,
  change: { connect?: number[]; disconnect?: number[] },
) {
  return updateEntry(
    { uid, kind: "collectionType", id },
    {
      [field]: {
        connect: (change.connect ?? []).map((target) => ({ id: target, position: { end: true } })),
        disconnect: (change.disconnect ?? []).map((target) => ({ id: target })),
      },
    },
  );
}

export interface BulkResult<T> {
  done: number;
  failed: { item: T; message: string }[];
}

/**
 * Последовательный прогон: по одному запросу за раз. Так Strapi не получает
 * лавину параллельных записей, а каждый вебхук ревалидации отрабатывает по очереди.
 */
export async function runSequential<T>(
  items: T[],
  task: (item: T) => Promise<unknown>,
  onProgress?: (processed: number, total: number) => void,
): Promise<BulkResult<T>> {
  const result: BulkResult<T> = { done: 0, failed: [] };
  for (let i = 0; i < items.length; i++) {
    try {
      await task(items[i]);
      result.done++;
    } catch (err) {
      result.failed.push({ item: items[i], message: err instanceof Error ? err.message : "Ошибка" });
    }
    onProgress?.(i + 1, items.length);
  }
  return result;
}
