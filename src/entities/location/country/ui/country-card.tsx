import Image from "next/image";
import { cn } from "@/shared/lib";
import { Country } from "../model/country-types";

type CountryCardProps = {
  country: Country;
  active: boolean;
  onClick: () => void;
};
// убрал тег figure из за него ломалось и сжималась картинка
export const CountryCard = (props: CountryCardProps) => {
  const { country, onClick, active } = props;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center group/span gap-3 relative text-white hover:text-black border-light-gray rounded-[7px] p-3 h-[68px] hover:bg-yellow-main hover:border-yellow-main cursor-pointer overflow-hidden",
        active && "bg-yellow-main text-black border-yellow-main",
      )}
    >
      {country.is_popular && (
        <span
          className={cn(
            "font-medium group-hover/span:bg-new-dark-grey group-hover/span:text-yellow-main border border-yellow-main bg-yellow-main rounded-[4px] text-xs  text-black absolute right-2 -translate-y-3  py-0.5 px-2 ",
            active && "bg-new-dark-grey text-yellow-main",
          )}
        >
          Популярное
        </span>
      )}
      <Image
        loading="lazy"
        decoding="async"
        src={country?.icon_url}
        alt={`country ${country?.name?.ru}`}
        width={36}
        height={36}
      />

      <p className="font-normal text-lg truncate xl:max-w-[15vw] max-w-[24vw]">
        {country?.name?.ru}
      </p>
    </div>
  );
};
