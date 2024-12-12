type CityCardMobileProps = {
  city: string;
  onClick: () => void;
};
export const CityCardMobile = (props: CityCardMobileProps) => {
  const { city, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="rounded-full bg-dark-gray shadow-[0px_2px_5px_1px_rgba(0,0,0,0.7)] p-4"
    >
      <p className="text-start">{city}</p>
    </div>
  );
};
