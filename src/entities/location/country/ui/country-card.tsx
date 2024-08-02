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
        "flex items-center gap-4 p-2 hover:bg-lime-200 cursor-pointer ",
        active && "bg-lime-200",
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
      <p>{country.name.ru}</p>
    </div>
  );
};
