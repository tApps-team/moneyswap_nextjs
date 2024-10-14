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
        "flex items-center   gap-4 border-2 text-white hover:text-black border-light-gray rounded-full p-3 h-[68px] hover:bg-yellow-main hover:border-yellow-main cursor-pointer overflow-hidden",
        active && "bg-yellow-main text-black border-yellow-main",
      )}
    >
      <Image
        loading="lazy"
        decoding="async"
        src={country?.icon_url}
        alt={`country ${country?.name?.ru}`}
        width={36}
        height={36}
      />

      <p className="uppercase font-semibold line-clamp-1   max-w-[20vw] ">{country?.name?.ru}</p>
    </div>
  );
};
