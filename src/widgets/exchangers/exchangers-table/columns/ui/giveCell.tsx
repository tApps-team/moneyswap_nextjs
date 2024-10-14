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
    <div className="flex gap-2 items-end">
      <div className="text-yellow-main text-base">{row.original.in_count}</div>
      <div className="font-normal text-sm">{row.original.valute_from}</div>
      {row.original.location && (
        <Link href={createUrl(row.original.location.code_name)}>
          <p>
            {row.original.exchange_marker === ExchangerMarker.cash
              ? `Наличные в городе ${row.original.location.name.ru}`
              : `Наличные в городе ${row.original.location.name.ru}`}
          </p>
        </Link>
      )}
    </div>
  );
};
