type CityCardMobileProps = {
  city: string;
  onClick: () => void;
};
export const CityCardMobile = (props: CityCardMobileProps) => {
  const { city, onClick } = props;
  return (
    <div onClick={onClick} className="rounded-[7px] bg-[#393C44]  p-4">
      <p className="text-start">{city}</p>
    </div>
  );
};
