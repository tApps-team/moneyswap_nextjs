import { Cell, Row } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Exchanger } from "@/entities/exchanger";
import { ExchangerMarker } from "@/shared/types";
type GiveCellProps = {
  row: Row<Exchanger>;
};
export const GiveCell = (props: GiveCellProps) => {
  const { row } = props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createUrl = (city: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("city", city);
    return `${pathname}?${params.toString()}`;
  };
  return (
    <div className="grid grid-flow-row justify-start items-start justify-items-start">
      <div className="text-yellow-main font-bold xl:text-lg text-base truncate max-w-[200px]">
        {row.original.in_count}
      </div>
      <div className="xl:text-base text-sm font-semibold truncate max-w-[200px]">
        {row.original.valute_from}
      </div>
      {row.original.location && (
        <Link href={createUrl(row.original.location.code_name)}>
          <p>
            {row.original.exchange_marker === ExchangerMarker.cash
              ? `В г. ${row.original.location.name.ru}`
              : `В г. ${row.original.location.name.ru}`}
          </p>
        </Link>
      )}
    </div>
  );
};
