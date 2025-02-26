import Image from "next/image";
import { cn } from "@/shared/lib";
import { Currency } from "../model/types/currencyType";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="relative bg-transparent h-full w-full grid grid-flow-col justify-start justify-items-start gap-5 py-2 md:px-3 px-1 text-white rounded-[7px] hover:bg-new-grey"
    >
      {currency?.is_popular && (
        <span
          className={cn(
            "absolute md:right-4 right-3 md:-translate-y-2 -translate-y-2 text-[10px] rounded-[3px] bg-yellow-main text-black text-center py-[2px] px-2 font-medium",
          )}
        >
          Популярное
        </span>
      )}
      <figure className="mobile-xl:w-[42px] mobile-xl:h-[42px] size-9 rounded-full overflow-hidden">
        <Image
          src={currency.icon_url}
          width={42}
          height={42}
          alt={`${currency?.name} (${currency?.code_name})`}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="h-full grid grid-flow-row justify-start justify-items-start items-stretch content-between mobile-xl:text-base text-sm">
        <p className="font-bold uppercase line-clamp-1 leading-none">{currency?.name?.ru}</p>
        <span className="font-medium text-font-dark-grey leading-none">{currency?.code_name}</span>
      </div>
    </div>
  );
};
