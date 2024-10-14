import { CurrencyPair } from "@/features/currency/currency-pair";
import { CurrencyPair as CurrencyPairType } from "@/entities/currency";
import { cn } from "@/shared/lib";
import { ScrollArea } from "@/shared/ui";
import { sortingCurrencyPair } from "../lib/sorting-currency-pair";

type CryptoDirectionProps = {
  currencyPair: CurrencyPairType[];
};
export const CryptoDirection = async (props: CryptoDirectionProps) => {
  const { currencyPair } = props;
  const sortedCurrencyPair = sortingCurrencyPair(currencyPair);
  const maxPointsCount = Math.max(...currencyPair.map((item) => item.pairCount));
  return (
    <aside className="grid grid-cols-1 grid-flow-row min-h-[36rem] max-h-[40rem] overflow-hidden  gap-4 items-start rounded-2xl  bg-dark-gray shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-5">
      <div className="grid-cols-2 grid">
        <p className="text-sm uppercase">Направления обменника</p>
        <p className="text-xs uppercase">Количество обменных пунктов по направлению</p>
      </div>

      <ScrollArea className="h-full  pr-3">
        <div className="flex flex-col gap-4  p-1">
          {sortedCurrencyPair.map((pair, index) => (
            <div
              className="grid grid-cols-[0.7fr,1fr]   gap-6 w-full "
              // key={pair.valute_from.name.en + pair.pointsCount}
              key={index}
            >
              <CurrencyPair currencyPair={pair} />
              <div
                style={{
                  width: `${(pair.pairCount / maxPointsCount) * 100}%`,
                }}
                className={cn(
                  `bg-[#606060] min-w-12 max-w-full rounded-[15px] flex items-center justify-end px-3 ml-auto`,
                )}
              >
                <p>{pair.pairCount}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
