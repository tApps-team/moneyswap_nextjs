/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from "next/image";
import { Card, CardContent, DialogClose } from "@/shared/ui";
import { City } from "..";
type CityCardProps = {
  city: City;
  onClick: (city: City) => void;
};
export const CityCard = (props: CityCardProps) => {
  const { city, onClick } = props;
  return (
    <Card className="border-none rounded-none">
      <CardContent className="py-2 hover:bg-slate-400">
        <DialogClose asChild>
          <div onClick={() => onClick(city)} className="flex items-center cursor-pointer ">
            <div>{city?.name.ru}</div>
          </div>
        </DialogClose>
      </CardContent>
    </Card>
  );
};
