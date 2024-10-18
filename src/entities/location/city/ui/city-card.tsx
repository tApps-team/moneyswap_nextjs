import { cn } from "@/shared/lib";
import { City } from "../model/city-types";

type CityCardProps = {
  city: City;
  onClick: () => void;
  active?: boolean;
};
export const CityCard = (props: CityCardProps) => {
  const { city, onClick, active } = props;
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-2 flex hover:text-black hover:border-none hover:bg-yellow-main rounded-full items-center h-[68px] border-light-gray",
        active && "bg-yellow-main text-black border-none",
      )}
    >
      <p className="uppercase line-clamp-1 text-start">{city?.name?.ru}</p>
    </div>
  );
};
