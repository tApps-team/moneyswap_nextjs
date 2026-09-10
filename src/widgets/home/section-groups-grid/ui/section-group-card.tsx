import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import {
  NavEntry,
  entryHref,
  entryIcon,
  entrySubtitle,
  entryTitle,
  getGroupSections,
} from "@/shared/consts";

interface SectionGroupCardProps {
  entry: NavEntry;
  index?: number;
}

/**
 * Карточка направления: заголовок, описание и ссылки внутрь.
 *
 * У группы в нижней строке перечислены её разделы, у отдельного сервиса —
 * одна ссылка на рейтинг, чтобы карточки в сетке не разъезжались по высоте.
 */
export const SectionGroupCard: FC<SectionGroupCardProps> = ({ entry, index = 0 }) => {
  const Icon = entryIcon(entry);
  const links =
    entry.kind === "group"
      ? getGroupSections(entry.group).map((section) => ({
          key: section.key,
          href: section.href,
          title: section.title,
        }))
      : [{ key: entry.key, href: entry.section.href, title: "Смотреть рейтинг" }];

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group grid grid-rows-[auto_auto_1fr] gap-4 h-full min-w-0 rounded-[20px] border border-new-grey/60 bg-new-dark-grey p-5 mobile-xl:p-6 transition-[border-color,transform] duration-300 hover:border-yellow-main/70 hover:-translate-y-0.5 animate-fade-in-up motion-reduce:animate-none motion-reduce:transition-none"
    >
      <span className="grid place-items-center size-11 shrink-0 rounded-[12px] bg-new-grey text-yellow-main">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>

      <Link href={entryHref(entry)} className="grid gap-2 min-w-0">
        <h3 className="unbounded_font uppercase leading-tight text-sm mobile-xl:text-base font-normal text-white transition-colors group-hover:text-yellow-main break-words">
          {entryTitle(entry)}
        </h3>
        <p className="text-light-gray text-sm leading-snug">{entrySubtitle(entry)}</p>
      </Link>

      <ul className="grid content-start gap-1.5 min-w-0">
        {links.map((link) => (
          <li key={link.key} className="min-w-0">
            <Link
              href={link.href}
              className="group/link flex items-center gap-2 min-w-0 text-sm text-light-gray transition-colors hover:text-yellow-main"
            >
              <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover/link:translate-x-1" />
              <span className="truncate">{link.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
