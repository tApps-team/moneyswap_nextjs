import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCurrecnyStore } from "@/entities/currency";
import { SwitcherIcon } from "@/shared/assets";
import { ExchangerMarker, directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySwitcherProps = {
  direction?: ExchangerMarker;
};

export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { direction } = props;
  const searchParams = useSearchParams();

  const params = useParams<{ slug: string[] }>();
  console.log(params.slug);
  const { getCashCurrency, getCurrency, giveCashCurrency, giveCurrency } = useCurrecnyStore(
    (state) => state,
  );
  const currentGetCurrency = direction === ExchangerMarker.cash ? getCashCurrency : getCurrency;
  const currentGiveCurrency = direction === ExchangerMarker.cash ? giveCashCurrency : giveCurrency;

  const switchUrl = () => {
    if (
      !params.slug &&
      direction === ExchangerMarker.no_cash &&
      currentGetCurrency &&
      currentGiveCurrency
    ) {
      return `/exchange/${currentGetCurrency?.code_name}-to-${currentGiveCurrency?.code_name}`;
    }
    if (params.slug && params.slug.length > 0) {
      const [valutes, ...rest] = params.slug;
      const [valuteFrom, valuteTo] = valutes.split("-to-");

      if (direction === ExchangerMarker.cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}/${rest.join("/")}`;
      }

      if (direction === ExchangerMarker.no_cash) {
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
