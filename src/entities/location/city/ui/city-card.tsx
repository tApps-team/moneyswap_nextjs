import { City } from "../model/city-types";

type CityCardProps = {
  city: City;
  onClick: () => void;
};
export const CityCard = (props: CityCardProps) => {
  const { city, onClick } = props;
  return (
    <div onClick={onClick} className="p-2 border">
      <p>{city.name.ru}</p>
    </div>
  );
};
