import { cache } from "react";
import { getExchangerList } from "@/entities/exchanger";

export interface ExchangerStats {
  /** Сколько направлений обмена открыто у обменника. */
  directions: number | null;
  /** Резервы строкой, как их отдаёт API: «$340 767 443» или «- - -». */
  reserves: string | null;
}

/**
 * Направления и резервы обменников.
 *
 * Отдельный запрос от top_exchanges: тот отдаёт только имя, лого и отзывы.
 * Список приходит целиком за один раз, поэтому карточкам он обходится в один
 * поход в сеть на всю полку, а не в один на каждую.
 *
 * cache() держит результат в пределах запроса — восемь карточек читают его
 * из одного промиса.
 */
export const getExchangerStats = cache(async (): Promise<Map<number, ExchangerStats>> => {
  try {
    const list = await getExchangerList();

    return new Map(
      (list ?? []).map((exchanger) => {
        // courses в типе числится строкой, а API отдаёт число — приводим сами
        const directions = Number(exchanger.courses);
        // «- - -» вместо суммы означает, что резервы обменник не публикует
        const hasReserves = /\d/.test(exchanger.reserves ?? "");

        return [
          exchanger.id,
          {
            directions: Number.isFinite(directions) && directions > 0 ? directions : null,
            reserves: hasReserves ? exchanger.reserves : null,
          },
        ];
      }),
    );
  } catch (error) {
    // Полка не должна ломаться из-за необязательных показателей
    console.error("getExchangerStats error:", error);
    return new Map();
  }
});
