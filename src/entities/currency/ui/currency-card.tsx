import Image from "next/image";
import { Currency } from "../model/types/currencyType";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick } = props;
  return (
    // <DialogClose asChild>
    <div
      onClick={onClick}
      className="h-full flex gap-4 border-2 rounded-full p-3 hover:bg-[#f6ff5f] hover:text-black hover:border-[#f6ff5f]  text-white border-[#bbbbbb] items-center"
    >
      <figure className="w-[42px] rounded-full overflow-hidden h-[42px]">
        <Image
          src={currency.icon_url}
          width={42}
          height={42}
          alt={`${currency?.name} (${currency?.code_name})`}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="flex flex-col items-start">
        <p className="font-bold uppercase line-clamp-1">{currency?.name?.ru}</p>
        <span>{currency?.code_name}</span>
      </div>
    </div>
    // </DialogClose>
  );
};
