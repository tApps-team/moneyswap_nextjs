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
        "flex items-center gap-4 border-2 text-white hover:text-black border-[#bbbbbb] rounded-full p-3 h-[68px] hover:bg-[#f6ff5f] hover:border-[#f6ff5f] cursor-pointer overflow-hidden",
        active && "bg-[#f6ff5f] text-black border-[#f6ff5f]",
      )}
    >
      <figure className="w-[36px] h-[36px]">
        <Image
          loading="lazy"
          decoding="async"
          src={country?.icon_url}
          alt={`country ${country?.name?.ru}`}
          width={36}
          height={36}
        />
      </figure>
      <p className="uppercase  font-semibold max-w-[20vw]">{country?.name?.ru}</p>
    </div>
  );
};
