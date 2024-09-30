import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCurrecnyStore } from "@/entities/currency";
import { SwitcherIcon } from "@/shared/assets";
import { IsEmptyObject } from "@/shared/lib";
import { ExchangerMarker, directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySwitcherProps = {
  direction?: ExchangerMarker;
};
const defaultCashValutes = {
  valuteFrom: "CASHRUB",
  valuteTo: "BTC",
};
const defaultNoCashValutes = {
  valuteFrom: "SBERRUB",
  valuteTo: "BTC",
};
export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { direction } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams<{
    slug: string[];
  }>();
  const city = searchParams.get("city") || "msk";
  const switchUrl = () => {
    const emptyParams = IsEmptyObject({ obj: params });

    if (emptyParams) {
      if (direction === ExchangerMarker.cash) {
        return `/exchange/${defaultCashValutes.valuteTo}-to-${defaultCashValutes.valuteFrom}?city=${city}`;
      }
      if (direction === ExchangerMarker.no_cash) {
        return `/exchange/${defaultNoCashValutes.valuteTo}-to-${defaultNoCashValutes.valuteFrom}`;
      }
    }
    if (!emptyParams) {
      const [valuteFrom, valuteTo] = params?.slug[0]?.split("-to-");
      if (direction === ExchangerMarker.cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}?city=${city}`;
      }
      if (direction === ExchangerMarker.no_cash) {
        return `/exchange/${valuteTo}-to-${valuteFrom}`;
      }
    }
    // const [valutes, ...rest] = params.slug;
    // const [valuteFrom, valuteTo] = valutes.split("-to-");

    // if (direction === ExchangerMarker.cash) {
    //   return `/exchange/${valuteTo}-to-${valuteFrom}?${rest.join("/")}`;
    // } else {
    //   return `/exchange/${valuteTo}-to-${valuteFrom}`;
    // }
    return "/";
  };

  return (
    <Link href={switchUrl()} className="mb-[20px] mx-6">
      <SwitcherIcon width={30} fill="#f6ff5f" />
    </Link>
  );
};
