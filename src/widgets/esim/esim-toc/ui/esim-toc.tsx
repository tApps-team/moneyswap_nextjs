import Link from "next/link";
import { FC } from "react";
import { DynamicContentItem } from "@/entities/strapi";

interface EsimTocProps {
  about: DynamicContentItem[];
}

export const EsimToc: FC<EsimTocProps> = ({ about }) => {
  const sections = about
    .filter((item) => item.paragraph?.title && item.paragraph?.title_id)
    .map((item) => ({
      id: item.paragraph!.title_id!,
      title: item.paragraph!.title!,
    }));

  if (!sections.length) {
    return null;
  }

  return (
    <nav className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-6 grid gap-4 h-fit sticky top-[120px]">
      <ol className="grid gap-3 list-none counter-reset-none">
        {sections.map((section, index) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className="flex gap-3 text-sm text-light-gray hover:text-yellow-main transition-colors"
            >
              <span className="text-yellow-main font-medium shrink-0">{index + 1}.</span>
              <span>{section.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};
