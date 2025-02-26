import { MobileCityArrowIcon } from "@/shared/assets";

type CityCardMobileProps = {
  city: string;
  onClick: () => void;
};
export const CityCardMobile = (props: CityCardMobileProps) => {
  const { city, onClick } = props;
  return (
    <div onClick={onClick} className="flex items-center relative w-full">
      <figure className="mr-6 size-[22px] flex justify-center items-center [&>svg]:object-contain overflow-hidden">
        <MobileCityArrowIcon className="rotate-180 w-[22px] h-[22px]" fill="#fff" />
      </figure>
      <h3 className="text-base truncate">{city}</h3>
    </div>
  );
};
