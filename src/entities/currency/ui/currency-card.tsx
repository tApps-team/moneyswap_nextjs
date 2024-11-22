import Image from "next/image";
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
      className="h-full w-full flex gap-4 border-0 shadow-[0px_2px_5px_1px_rgba(0,0,0,0.7)] rounded-full p-3 hover:bg-yellow-main hover:text-black hover:border-yellow-main  text-white border-light-gray items-center"
    >
      <figure className="mobile-xl:w-[42px] size-8 rounded-full overflow-hidden mobile-xl:h-[42px]">
        <Image
          src={currency.icon_url}
          width={42}
          height={42}
          alt={`${currency?.name} (${currency?.code_name})`}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="flex flex-col  text-xs mobile-xl:text-base items-start">
        <p className="font-bold uppercase line-clamp-1">{currency?.name?.ru}</p>
        <span>{currency?.code_name}</span>
      </div>
    </div>
  );
};
