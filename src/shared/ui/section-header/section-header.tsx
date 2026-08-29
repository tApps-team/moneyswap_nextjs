import { FC } from "react";

interface SectionHeaderProps {
  title: string;
  /** Короткое описание раздела под заголовком. */
  subtitle?: string;
}

/** Шапка страницы-рейтинга — та же типографика, что у eSIM, ВЭД и виртуальных карт. */
export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <h1 className="unbounded_font text-yellow-main uppercase xl:text-3xl mobile-xl:text-2xl text-xl font-semibold leading-tight max-w-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-light-gray text-sm mobile-xl:text-base max-w-3xl">{subtitle}</p>
      ) : null}
    </div>
  );
};
