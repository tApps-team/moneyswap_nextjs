import Link from "next/link";
import { FC } from "react";
import { Tag } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface TagsListProps {
  tags: Tag[];
}

export const TagsList: FC<TagsListProps> = ({ tags }) => {
  return (
    <section className="grid grid-flow-row gap-2 rounded-[20px] bg-[#000] px-6 py-4">
      <h3 className="uppercase text-[#f6ff5f] font-semibold text-md truncate">
        Популярные хэштеги
      </h3>
      <div className="flex flex-wrap">
        {tags?.map((tag) => (
          <Link
            scroll={false}
            href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
            className="mr-2 text-[#ddd] text-xs leading-2 uppercase hover:text-[#f6ff5f] cursor-pointer transition-all hover:transition-all duration-300"
            key={tag?.id}
          >
            {tag?.name}
          </Link>
        ))}
      </div>
    </section>
  );
};
