import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { SectionGroup, getGroupSections } from "@/shared/consts";

interface SectionGroupCardProps {
  group: SectionGroup;
  index?: number;
}

/** Карточка группы: заголовок, описание и прямые ссылки на разделы внутри. */
export const SectionGroupCard: FC<SectionGroupCardProps> = ({ group, index = 0 }) => {
  const sections = getGroupSections(group);
  const Icon = group.icon;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group grid grid-rows-[auto_auto_1fr] gap-4 h-full min-w-0 rounded-[20px] border border-new-grey/60 bg-new-dark-grey p-5 mobile-xl:p-6 transition-[border-color,transform] duration-300 hover:border-yellow-main/70 hover:-translate-y-0.5 animate-fade-in-up motion-reduce:animate-none motion-reduce:transition-none"
    >
      <span className="grid place-items-center size-11 shrink-0 rounded-[12px] bg-new-grey text-yellow-main">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>

      <Link href={group.href} className="grid gap-2 min-w-0">
        <h3 className="unbounded_font uppercase leading-tight text-sm mobile-xl:text-base font-normal text-white transition-colors group-hover:text-yellow-main break-words">
          {group.title}
        </h3>
        <p className="text-light-gray text-sm leading-snug">{group.subtitle}</p>
      </Link>

      <ul className="grid content-start gap-1.5 min-w-0">
        {sections.map((section) => (
          <li key={section.key} className="min-w-0">
            <Link
              href={section.href}
              className="group/link flex items-center gap-2 min-w-0 text-sm text-light-gray transition-colors hover:text-yellow-main"
            >
              <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover/link:translate-x-1" />
              <span className="truncate">{section.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
