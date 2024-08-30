import { FC } from "react";

interface ShowMoreProps {
  onClick: () => void;
}

export const ShowMore: FC<ShowMoreProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="uppercase text-sm font-semibold px-6 py-4 rounded-[35px] text-[#000] bg-[#f6ff5f] hover:bg-[#ddd] cursor-pointer"
    >
      Показать ещё
    </button>
  );
};
