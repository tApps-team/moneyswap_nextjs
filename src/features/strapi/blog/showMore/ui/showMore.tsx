import { FC } from "react";

interface ShowMoreProps {
  onClick: () => void;
}

export const ShowMore: FC<ShowMoreProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mobile-xl:sm uppercase text-xs font-semibold px-6 py-4 rounded-[35px] text-black bg-yellow-main hover:bg-[#ddd] cursor-pointer"
    >
      Показать ещё
    </button>
  );
};
