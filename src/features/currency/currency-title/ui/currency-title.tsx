import { FC } from "react";

interface CurrencyTitleProps {
  give?: string;
  get?: string;
}

export const CurrencyTitle: FC<CurrencyTitleProps> = ({ give, get }) => {
  return (
    <div className="lg:hidden md:mt-4 md:mb-6 mt-2 mb-4 grid justify-center justify-items-center mobile-xl:gap-2 gap-0 md:text-xl mobile-xl:text-base text-sm">
      <h3 className="uppercase font-bold">Лучшие курсы</h3>
      <h4 className="font-light">
        {give} на {get}
      </h4>
    </div>
  );
};
