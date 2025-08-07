import Image from "next/image";
import searchAnimation from "/public/animated/search_spin.gif";
import { CurrencyPair } from "@/features/currency";
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
    <aside className="grid h-full grid-rows-[auto_1fr] lg:min-h-[36rem] min-h-auto max-h-[40rem] overflow-hidden gap-4 items-start rounded-[15px] bg-new-dark-grey xl:px-6 mobile:pt-10 mobile:pb-6 mobile:px-4 pt-5 px-3 pb-4">
      <div className="grid lg:grid-cols-[0.7fr,1fr] md:grid-cols-[0.3fr,1fr] mobile-xl:grid-cols-[0.7fr,1fr] grid-cols-1 gap-6 w-full">
        <p className="text-sm text-center uppercase">Направления</p>
        <p className="text-sm hidden mobile-xl:block uppercase text-center">Обменные пункты</p>
      </div>

      <ScrollArea className="h-full pr-1">
        <div className="flex flex-col gap-4 p-1 pb-2">
          {sortedCurrencyPair?.length > 0 ? (
            sortedCurrencyPair?.map((pair, index) => (
              <div
              className="grid grid-cols-[0.7fr,1fr] md:grid-cols-[0.3fr,1fr] lg:grid-cols-[0.7fr,1fr] xl:gap-6 gap-4 w-full"
              key={index}
            >
              <CurrencyPair currencyPair={pair} />
              <div
                style={{
                  width: `${(pair?.pairCount / maxPointsCount) * 100}%`,
                }}
                className={cn(
                  `bg-new-grey min-w-12 max-w-full mobile-xl:rounded-xl rounded-[7.5px] flex items-center justify-end px-3 ml-auto`,
                )}
              >
                <p>{pair?.pairCount}</p>
              </div>
            </div>
            ))
          ) : (
            <div className="flex flex-col gap-8 justify-center items-center mt-10">
              <Image
                src={searchAnimation}
                alt="search spin"
                className="md:size-[5vw] mobile-xl:size-[7.5vw] size-[20vw]"
              />
              <p className="text-sm text-center">Активных направлений нет...</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
