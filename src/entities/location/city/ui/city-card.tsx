"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib";
import { City } from "../model/city-types";

type CityCardProps = {
  city: City;
  onClick: () => void;
  active?: boolean;
};
export const CityCard = (props: CityCardProps) => {
  const { city, onClick, active } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("city", city?.code_name.toString());
  return (
    <Link
      href={pathname + "?" + params}
      onClick={onClick}
      className={cn(
        "p-3 lg:px-8 lg:py-5 md:px-5 md:py-3 flex hover:text-black hover:border-none  hover:bg-yellow-main rounded-[7px] cursor-pointer items-center h-[68px] border-light-gray",
        active && "bg-yellow-main text-black border-none",
      )}
    >
      <p className="min-w-0 truncate text-start">{city?.name?.ru}</p>
    </Link>
  );
};
