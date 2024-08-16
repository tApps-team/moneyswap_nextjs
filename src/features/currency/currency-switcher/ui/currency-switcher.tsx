import Link from "next/link";
import { useParams } from "next/navigation";
import { SwitcherIcon } from "@/shared/assets";
import { directions } from "@/shared/types";
import { Button } from "@/shared/ui";

type CurrencySwitcherProps = {
  direction?: directions;
};

export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { direction } = props;
  const params = useParams<{ slug: string[] }>();

  const switchUrl = () => {
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
      <SwitcherIcon width={30} />
    </Link>
  );
};
