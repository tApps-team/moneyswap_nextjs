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
    <aside className="grid h-full grid-cols-1 grid-flow-row min-h-[36rem] max-h-[40rem] overflow-hidden  gap-4 items-start rounded-2xl  bg-new-dark-grey  py-10 px-6">
      <div className="grid grid-cols-[0.7fr,1fr] md:grid-cols-[0.3fr,1fr] lg:grid-cols-[0.7fr,1fr] gap-6 w-full">
        <p className="md:text-xs mobile-xl:text-2xs text-2xs text-center uppercase">Направления</p>
        <p className="md:text-xs mobile-xl:text-2xs hidden mobile-xl:block text-2xs uppercase text-center">
          Обменные пункты
        </p>
      </div>

      <ScrollArea className="h-full pr-3 ">
        <div className="flex flex-col gap-4 p-1 pb-2">
          {sortedCurrencyPair.map((pair, index) => (
            <div
              className="grid grid-cols-[0.7fr,1fr] md:grid-cols-[0.3fr,1fr] lg:grid-cols-[0.7fr,1fr] gap-6 w-full"
              key={index}
            >
              <CurrencyPair currencyPair={pair} />
              <div
                style={{
                  width: `${(pair.pairCount / maxPointsCount) * 100}%`,
                }}
                className={cn(
                  `bg-new-grey min-w-12 max-w-full rounded-xl flex items-center justify-end px-3 ml-auto`,
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
