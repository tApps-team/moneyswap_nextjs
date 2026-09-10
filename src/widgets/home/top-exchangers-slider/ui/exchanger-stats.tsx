import { FC } from "react";
import { PreviewRow, PreviewRowSkeleton, getExchangerStats } from "@/features/rating-preview";

interface ExchangerStatsProps {
  exchangerId: number;
}

/**
 * Направления и резервы обменника.
 *
 * Живёт отдельным серверным компонентом под своим Suspense: список обменников
 * с этими показателями приходит вторым запросом, и ждать его ради полки,
 * которая уже готова, незачем.
 */
export const ExchangerStats: FC<ExchangerStatsProps> = async ({ exchangerId }) => {
  const stats = await getExchangerStats();
  const item = stats.get(exchangerId);

  if (!item) return null;

  return (
    <>
      {item.directions ? (
        <PreviewRow
          field={{ label: "Направлений", value: item.directions.toLocaleString("ru-RU") }}
        />
      ) : null}
      {item.reserves ? <PreviewRow field={{ label: "Резервы", value: item.reserves }} /> : null}
    </>
  );
};

/** Заглушка на время догрузки — ровно та же высота, что у готовых строк. */
export const ExchangerStatsSkeleton = () => (
  <>
    <PreviewRowSkeleton label="Направлений" />
    <PreviewRowSkeleton label="Резервы" />
  </>
);
