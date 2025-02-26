import Image from "next/image";
import { cn } from "@/shared/lib";
import { Country } from "../model/country-types";

type CountryCardProps = {
  country: Country;
  active?: boolean;
  onClick: () => void;
};
// убрал тег figure из за него ломалось и сжималась картинка
export const CountryCard = (props: CountryCardProps) => {
  const { country, onClick, active } = props;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center w-full group/span gap-5 relative text-inherit hover:text-black border-light-gray md:p-3 p-0 lg:px-8 lg:py-5 md:px-5 md:py-3 md:h-[68px] h-auto hover:bg-yellow-main hover:border-yellow-main cursor-pointer overflow-hidden",
        active && "md:bg-yellow-main md:text-black md:border-yellow-main",
      )}
    >
      <Image
        loading="lazy"
        decoding="async"
        src={country?.icon_url}
        alt={`country ${country?.name?.ru}`}
        width={36}
        height={36}
        className="mobile:size-9 size-8"
      />

      <p className="font-normal md:text-lg text-base truncate leading-none">{country?.name?.ru}</p>
    </div>
  );
};
