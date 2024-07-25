import Image from "next/image";
import { Currency } from "../model/types/currencyType";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: (currency: Currency) => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick } = props;
  return (
    // <DialogClose asChild>
    <div onClick={() => onClick?.(currency)} className="flex gap-4 items-center">
      <Image
        src={currency.icon_url}
        width={30}
        height={30}
        alt={`${currency.name} (${currency.code_name})`}
        loading="lazy"
        decoding="async"
      />
      <div className="flex flex-col items-start">
        <p>{currency.name.ru}</p>
        <span>{currency.code_name}</span>
      </div>
    </div>
    // </DialogClose>
  );
};
