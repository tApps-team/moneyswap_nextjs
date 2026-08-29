import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { RatingSection } from "@/shared/consts";

export interface RatingSectionCardProps {
  section: RatingSection;
  /** Описание раздела из Strapi; если его нет — берётся фолбэк из конфига. */
  description?: string | null;
}

/** Карточка раздела-рейтинга на странице /ratings. */
export const RatingSectionCard: FC<RatingSectionCardProps> = ({ section, description }) => {
  const Icon = section.icon;

  return (
    <Link
      href={section.href}
      className="group grid grid-rows-[auto_1fr_auto] gap-3 mobile-xl:gap-4 h-full min-w-0 rounded-[20px] border border-new-grey/60 bg-new-dark-grey p-5 mobile-xl:p-6 transition-colors hover:border-yellow-main/70"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid place-items-center size-11 shrink-0 rounded-[12px] bg-new-grey text-yellow-main">
          <Icon className="size-6" strokeWidth={1.5} />
        </span>
        <h2 className="unbounded_font uppercase leading-tight text-sm mobile-xl:text-base font-normal text-white break-words min-w-0 transition-colors group-hover:text-yellow-main">
          {section.title}
        </h2>
      </div>

      <p className="text-light-gray text-sm leading-snug line-clamp-5">
        {description || section.description}
      </p>

      <span className="flex items-center gap-2 text-yellow-main text-sm font-medium">
        Смотреть рейтинг
        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
};
