import { FC } from "react";
import { ArticleSearch, TableOfContentsBlock, TagsList, TelegramBanner } from "@/features/strapi";
import { getAllTags, TableOfContents } from "@/entities/strapi";
import { ScrollArea } from "@/shared/ui";

interface BlogSidebarProps {
  searchValue?: string | null;
  table_of_contents?: TableOfContents[];
  isMain?: boolean;
}

export const BlogSidebar: FC<BlogSidebarProps> = async ({
  searchValue,
  table_of_contents,
  isMain,
}) => {
  const { data: tags } = await getAllTags();

  return (
    <div className={`${isMain && "lg:h-full h-auto lg:static sticky top-[100px]"}`}>
      <section
        className={`grid grid-rows-[auto_1fr_auto] xl:gap-6 gap-4 lg:rounded-[15px] rounded-[10px] bg-new-dark-grey backdrop-blur-lg xl:p-6 lg:p-5 p-4 overflow-hidden ${isMain && "h-full"}`}
      >
        <ArticleSearch currentValue={searchValue || null} />
        {table_of_contents ? (
          <TableOfContentsBlock table_of_contents={table_of_contents || []} />
        ) : (
          <TagsList tags={tags?.tags} />
        )}
        <TelegramBanner />
      </section>
    </div>
  );
};
