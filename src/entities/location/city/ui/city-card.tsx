import { cx } from "class-variance-authority";
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
      className={cx(
        "p-4 border flex rounded-full items-center min-h-[60px]  border-[#bbbbbb]",
        active && "bg-[#f6ff5f] text-black",
      )}
    >
      <p className="uppercase">{city.name.ru}</p>
    </div>
  );
};
