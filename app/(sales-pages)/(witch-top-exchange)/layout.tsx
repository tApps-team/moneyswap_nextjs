import { TopExchange } from "@/features/top-exchange/top-exchange-sales-pages";
import { ExchangeType, getPopularValutes, getRandomValutes } from "@/entities/currency";
import { ExchangerMarker, directions } from "@/shared/types";

export default async function SellLayout({ children }: { children: React.ReactNode }) {
  const popularCashDirections = await getPopularValutes({
    exchange_marker: ExchangeType.cash,
    limit: 6,
  });
  const popularNoncashDirections = await getPopularValutes({
    exchange_marker: ExchangeType.no_cash,
    limit: 6,
  });
  const randomCashDirections = await getRandomValutes({
    exchange_marker: ExchangeType.cash,
    limit: 6,
  });
  const randomNoncashDirections = await getRandomValutes({
    exchange_marker: ExchangeType.no_cash,
    limit: 6,
  });
  return (
    <div>
      {children}
      <TopExchange
        popularCashDirections={popularCashDirections}
        popularNoncashDirections={popularNoncashDirections}
        randomCashDirections={randomCashDirections}
        randomNoncashDirections={randomNoncashDirections}
        direction={ExchangerMarker.no_cash}
      />
    </div>
  );
}
