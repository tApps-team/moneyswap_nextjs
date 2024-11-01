import Link from "next/link";
import { FC } from "react";
import { Tag } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface TagsListProps {
  tags: Tag[];
}

export const TagsList: FC<TagsListProps> = ({ tags }) => {
  return (
    <section className="rounded-[20px] bg-[#000] py-4 px-3">
      <div className="grid grid-flow-row gap-3">
        <div className="px-3">
          <h3 className="uppercase text-yellow-main font-semibold text-md truncate">
            Популярные хэштеги
          </h3>
        </div>
        <section className="flex flex-wrap px-3 overflow-y-auto max-h-[130px] h-[calc(100vw_/_10)]">
          {tags?.map((tag) => (
            <Link
              scroll={false}
              href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
              className="mr-2 text-[#ddd] text-xs leading-2 uppercase hover:text-yellow-main cursor-pointer transition-all hover:transition-all duration-300"
              key={tag?.id}
            >
              {tag?.name}
            </Link>
          ))}
        </section>
      </div>
    </section>
  );
};
