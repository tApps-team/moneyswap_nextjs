import { FC } from "react";

interface ShowMoreProps {
  onClick: () => void;
}

export const ShowMore: FC<ShowMoreProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="max:text-base mobile-xl:text-sm text-xs px-6 py-4 rounded-[10px] text-black bg-yellow-main hover:bg-new-light-grey hover:text-font-light-grey cursor-pointer font-normal"
    >
      Показать ещё
    </button>
  );
};
