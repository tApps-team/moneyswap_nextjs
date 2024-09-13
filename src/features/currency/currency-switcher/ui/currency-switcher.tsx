import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrecnyStore } from "@/entities/currency";
import { SwitcherIcon } from "@/shared/assets";
import { directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySwitcherProps = {
  direction?: directions;
};

export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { direction } = props;
  const params = useParams<{ slug: string[] }>();
  const { getCashCurrency, getCurrency, giveCashCurrency, giveCurrency } = useCurrecnyStore(
    (state) => state,
  );
  const currentGetCurrency = direction === directions.cash ? getCashCurrency : getCurrency;
  const currentGiveCurrency = direction === directions.cash ? giveCashCurrency : giveCurrency;

  const switchUrl = () => {
    if (
      !params.slug &&
      direction === directions.noncash &&
      currentGetCurrency &&
      currentGiveCurrency
    ) {
      return `/exchange/${currentGetCurrency?.code_name}-to-${currentGiveCurrency?.code_name}`;
    }
    if (params.slug && params.slug.length > 0) {
      const [valutes, ...rest] = params.slug;
      const [valuteFrom, valuteTo] = valutes.split("-to-");

      if (direction === directions.cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}/${rest.join("/")}`;
      }

      if (direction === directions.noncash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}`;
      }
    }
    return "/";
  };

  return (
    <Link href={switchUrl()} className="mb-[20px] mx-6">
      <SwitcherIcon width={30} fill="#f6ff5f" />
    </Link>
  );
};
