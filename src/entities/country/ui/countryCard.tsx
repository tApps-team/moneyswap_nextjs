/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from "next/image";
import { Card, CardContent } from "@/shared/ui";
import { Country } from "..";
type CountryCardProps = {
  country: Country;
  onClick: (countryId: number) => void;
};
export const CountryCard = (props: CountryCardProps) => {
  const { country, onClick } = props;
  return (
    <Card className="border-none rounded-none">
      <CardContent className="py-2 hover:bg-slate-400">
        <div onClick={() => onClick(country?.id)} className="flex items-center cursor-pointer ">
          <Image
            src={country?.icon_url}
            alt={`country ${country.name.ru}`}
            width={32}
            height={32}
          />
          <div>{country?.name.ru}</div>
        </div>
      </CardContent>
    </Card>
  );
};
