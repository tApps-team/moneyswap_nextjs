import { CellContext, Row } from "@tanstack/react-table";
import { useCurrecnyStore } from "@/entities/currency";
import { useDirectionStore } from "@/entities/direction";
import { Exchanger } from "@/entities/exchanger";
import { directions } from "@/shared/types";
type GiveCellProps = {
  row: Row<Exchanger>;
};
export const GiveCell = (props: GiveCellProps) => {
  const { row } = props;
  const { giveCashCurrencyAmount, giveCurrencyAmount, getCashCurrencyAmount, getCurrencyAmount } =
    useCurrecnyStore((state) => state);
  const direction = useDirectionStore((state) => state.direction);
  const currenctGiveAmount =
    direction === directions.cash ? giveCashCurrencyAmount : giveCurrencyAmount;
  const currenctGetAmount =
    direction === directions.cash ? getCashCurrencyAmount : getCurrencyAmount;
  return (
    <div className="flex gap-2 items-end">
      <div className="text-[#f6ff5f] text-base">
        {currenctGiveAmount ? currenctGiveAmount * (currenctGetAmount || 1) : row.original.in_count}
      </div>
      <div className="font-normal text-sm">{row.original.valute_from}</div>
    </div>
  );
};
