import Link from "next/link";
import { FC } from "react";
import { Tag } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface TagsListProps {
  tags: Tag[];
}

export const TagsList: FC<TagsListProps> = ({ tags }) => {
  return (
    <section className="rounded-[20px] bg-[#000] lg:py-4 lg:px-3 py-3 px-2">
      <div className="grid grid-flow-row gap-3">
        <div className="px-3">
          <h3 className="uppercase text-yellow-main font-semibold xl:text-base lg:text-sm text-xs truncate lg:min-w-auto md:min-w-[24vw] min-w-auto">
            Популярные хэштеги
          </h3>
        </div>
        <section className="flex flex-wrap px-3 overflow-y-auto max-h-[130px] xl:h-[calc(100vw_/_10)] h-[calc(100vw_/_14)]">
          {tags?.map((tag) => (
            <Link
              scroll={false}
              href={`${routes.blog}/${routes.tag}/${tag?.tag}`}
              className="mr-2 text-[#ddd] lg:text-xs text-2xs leading-2 uppercase hover:text-yellow-main cursor-pointer transition-all hover:transition-all duration-300"
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
