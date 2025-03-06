"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MobileCityArrowIcon } from "@/shared/assets";
import { City } from "../model/city-types";

type CityCardMobileProps = {
  city: City;
  onClick: () => void;
  active?: boolean;
};
export const CityCardMobile = (props: CityCardMobileProps) => {
  const { city, onClick } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("city", city?.code_name.toString());
  return (
    <Link
      href={pathname + "?" + params}
      onClick={onClick}
      className="flex items-center relative w-full"
    >
      <figure className="mr-6 size-[22px] flex justify-center items-center [&>svg]:object-contain overflow-hidden">
        <MobileCityArrowIcon className="rotate-180 w-[22px] h-[22px]" fill="#fff" />
      </figure>
      <h3 className="text-base truncate">{city?.name?.ru}</h3>
    </Link>
  );
};
