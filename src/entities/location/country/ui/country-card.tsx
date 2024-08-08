import { cx } from "class-variance-authority";
import Image from "next/image";
import { Country } from "../model/country-types";

type CountryCardProps = {
  country: Country;
  active: boolean;
  onClick: () => void;
};
export const CountryCard = (props: CountryCardProps) => {
  const { country, onClick, active } = props;
  return (
    <div
      onClick={onClick}
      className={cx(
        "flex  min-h-[60px] items-center gap-4 border text-white hover:text-black border-[#bbbbbb] rounded-full p-2 hover:bg-[#f6ff5f] cursor-pointer ",
        active && "bg-[#f6ff5f] text-black",
      )}
    >
      <Image
        loading="lazy"
        decoding="async"
        src={country.icon_url}
        alt={`country ${country.name.ru}`}
        width={32}
        height={32}
      />
      <p className="uppercase truncate">{country.name.ru}</p>
    </div>
  );
};
